import { eventUpdater } from "../events/event-updater";
import { EventCard } from "./event-cards";
import { EventResolver } from "./event-resolver";
import { RequestResolver } from "./request-resolver";
import { slideBattlefieldDown } from "./battlefield-utils";
import {
  makeEventDeck,
  makeSiegeDeck,
  makeTroopDeck,
  makeTurrets,
} from "./setup-utils";
import { SiegeResolver } from "./siege-resolver";
import {
  AttackType,
  BattlefieldCard,
  Dice,
  isTroopCard,
  RoundStage,
  SiegeEngineCard,
  TroopCard,
  Turret,
} from "./types";
import { diceRoll } from "./utils";
import { Champion } from "./champion-cards";
import {
  PendingDiceSelection,
  PendingChampionSelection,
  PendingTroopCardBrowser,
  PendingEventCardBrowser,
  PendingSiegeSelection,
  PendingEventSelection,
  PendingTurretSelection,
  PendingTroopSelection,
} from "./pending-selection-types";
("./siege-engine-cards");

interface PlannedDice {
  dice: Dice;
  pos: { x: number; y: number };
}

export class GameState {
  currentRound = 1;
  maxRounds = 7;
  roundStage: RoundStage = RoundStage.A_RollDice;

  siegeDeck: SiegeEngineCard[];
  troopDeck: TroopCard[];
  championDrawDeck: Champion[] = [];
  championDiscardDeck: Champion[] = [];
  eventDeck: EventCard[];
  playerHand: TroopCard[];
  battlefield: (BattlefieldCard | undefined)[][] = []; // by column, index 0 is front/vanguard
  activeDice: Dice[] = [];
  spentDice: Dice[] = [];
  activeChampions: Champion[] = [];
  turrets: Turret[];

  // Transient
  pendingDiceSelection?: PendingDiceSelection;
  pendingChampionSelection?: PendingChampionSelection;
  pendingTroopCardBrowser?: PendingTroopCardBrowser;
  pendingEventCardBrowser?: PendingEventCardBrowser;
  pendingSiegeSelection?: PendingSiegeSelection;
  pendingEventSelection?: PendingEventSelection;
  pendingTurretSelection?: PendingTurretSelection;
  pendingTroopSelection?: PendingTroopSelection;
  pendingDicePlan = new Map<BattlefieldCard, PlannedDice[]>();
  defeatedSiegeCards = 0;

  strengthDice: number;
  holyDice: number;

  private requestResolver: RequestResolver;
  private siegeResolver: SiegeResolver;
  private eventResolver: EventResolver;

  constructor() {
    this.requestResolver = new RequestResolver(this);
    this.siegeResolver = new SiegeResolver(this, this.requestResolver);
    this.eventResolver = new EventResolver(
      this,
      this.siegeResolver,
      this.requestResolver,
    );

    // Setup
    this.siegeDeck = makeSiegeDeck();
    const troopDeck = makeTroopDeck();
    this.playerHand = troopDeck.splice(-2);
    this.troopDeck = troopDeck;
    this.eventDeck = makeEventDeck();
    this.turrets = makeTurrets();
    this.battlefield = this.setupBattlefield();
    this.strengthDice = 3;
    this.holyDice = 2;
  }

  rollPlayerDice() {
    // Note: this creates new dice since ids will change
    for (let i = 0; i < this.strengthDice; i++) {
      this.activeDice.push({
        id: crypto.randomUUID(),
        type: AttackType.Strength,
        value: diceRoll(),
      });
    }

    for (let i = 0; i < this.holyDice; i++) {
      this.activeDice.push({
        id: crypto.randomUUID(),
        type: AttackType.Holy,
        value: diceRoll(),
      });
    }

    eventUpdater.fire("dice-update");

    this.toStage(RoundStage.B_ResolveSiege);
  }

  dropDiceOnCard(
    diceId: string,
    pos: { x: number; y: number },
    card: BattlefieldCard,
  ) {
    // Get the dice
    const dice = this.activeDice.find((die) => diceId === die.id);
    if (!dice) return;

    // This dice might be moving from another card
    for (const [plannedCard, plannedDice] of this.pendingDicePlan) {
      // Remove the dropped dice from this card
      const remainingDice = plannedDice.filter(
        (planned) => planned.dice.id !== diceId,
      );

      // If nothing was removed, it was never here! Check other cards
      if (remainingDice.length === plannedDice.length) continue;

      // Otherwise, update the old card with remaining dice (minus dropped dice)
      if (remainingDice.length)
        this.pendingDicePlan.set(plannedCard, remainingDice);
      else this.pendingDicePlan.delete(plannedCard); // unless that was the only one, so delete
    }

    // Update new card with dropped dice
    const plannedDice = this.pendingDicePlan.get(card) ?? [];
    plannedDice.push({ dice, pos });
    this.pendingDicePlan.set(card, plannedDice);

    eventUpdater.fire("planned-dice-update");
  }

  isDicePlanned(dice: Dice) {
    for (const [_, plannedDice] of this.pendingDicePlan) {
      if (plannedDice.find((planned) => planned.dice.id === dice.id))
        return true;
    }
    return false;
  }

  unplanDice(dice: Dice) {
    for (const [plannedCard, plannedDice] of this.pendingDicePlan) {
      const remainingDice = plannedDice.filter(
        (planned) => planned.dice.id !== dice.id,
      );
      if (remainingDice.length === plannedDice.length) continue;
      if (remainingDice.length)
        this.pendingDicePlan.set(plannedCard, remainingDice);
      else this.pendingDicePlan.delete(plannedCard);
      eventUpdater.fire("planned-dice-update");
    }
  }

  defeatCard(card: BattlefieldCard) {
    const column = this.battlefield.find((cards) => cards.includes(card));
    if (!column || this.roundStage !== RoundStage.D_Action) return;

    // todo actually check if it can be defeated first (but probably before this fn)
    const rowIndex = column.indexOf(card);
    column[rowIndex] = undefined;
    this.pendingDicePlan.delete(card);
    if (isTroopCard(card)) this.playerHand.push(card);
    else this.defeatedSiegeCards++;

    eventUpdater.fire("battlefield-card-defeated");
  }

  getColumnIndex(card: BattlefieldCard) {
    return this.battlefield.findIndex((col) => col.includes(card));
  }

  private setupBattlefield() {
    const battlefield: (BattlefieldCard | undefined)[][] = [];

    // There are 5 columns on the battlefield
    for (let col = 0; col < 5; col++) {
      const column: BattlefieldCard[] = [];

      // Put 4 troops in first 4 spots
      for (let i = 0; i < 4; i++) {
        column.push(this.troopDeck.pop()!);
      }

      // Seige engine at the top in last spot
      column.push(this.siegeDeck.pop()!);

      battlefield.push(column);
    }

    return battlefield;
  }

  toStage(nextStage: RoundStage) {
    this.setStage(nextStage);

    switch (nextStage) {
      case RoundStage.A_RollDice:
        // Flip all champions
        // Await player rolling dice
        break;
      case RoundStage.B_ResolveSiege:
        this.siegeResolver.resolveEngines();
        break;
      case RoundStage.C_ResolveEvent:
        this.eventResolver.resolveEvent();
        break;
      case RoundStage.F_Advance:
        this.battlefield = slideBattlefieldDown(this.battlefield);
        eventUpdater.fire("battlefield-update");
        break;
    }
  }

  private setStage(stage: RoundStage) {
    this.roundStage = stage;
    eventUpdater.fire("round-stage-update");
  }

  gameOver() {
    console.log("game over!");
  }
}
