import { eventUpdater } from "../events/event-updater";
import { EventCard } from "./event-cards";
import { EventResolver } from "./event-resolver";
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
  RoundStage,
  SiegeEngineCard,
  ITroopCard,
  Champion,
  Turret,
} from "./types";
import { diceRoll } from "./utils";
("./siege-engine-cards");

interface PendingDiceSelection {
  onSelect: (dice: Dice) => void;
  type?: AttackType;
  mustMatchValue?: number;
}

interface PendingChampionSelection {
  canBeFlipped: boolean;
  onSelect: (champion: Champion) => void;
}

interface PendingSiegeSelection {
  validChoices: SiegeEngineCard[];
  onSelect: (siege: SiegeEngineCard) => void;
}
interface PendingTroopCardBrowser {
  cards: ITroopCard[];
  onAccept: (cards: ITroopCard[]) => void;
}

interface PendingEventSelection {
  eventCard: EventCard;
  onSelect: () => void;
}

export class GameState {
  currentRound = 1;
  maxRounds = 7;
  roundStage: RoundStage = RoundStage.A_RollDice;

  siegeDeck: SiegeEngineCard[];
  troopDeck: ITroopCard[];
  championDrawDeck: Champion[] = [];
  championDiscardDeck: Champion[] = [];
  eventDeck: EventCard[];
  playerHand: ITroopCard[];
  battlefield: BattlefieldCard[][] = []; // by column, index 0 is front/vanguard
  activeDice: Dice[] = [];
  spentDice: Dice[] = [];
  activeChampions: Champion[] = [];
  turrets: Turret[];

  // Transient
  pendingDiceSelection?: PendingDiceSelection;
  pendingChampionSelection?: PendingChampionSelection;
  pendingTroopCardBrowser?: PendingTroopCardBrowser;
  pendingSiegeSelection?: PendingSiegeSelection;
  pendingEventSelection?: PendingEventSelection;

  strengthDice: number;
  holyDice: number;

  private siegeResolver: SiegeResolver;
  private eventResolver: EventResolver;

  constructor() {
    this.siegeResolver = new SiegeResolver(this);
    this.eventResolver = new EventResolver(this);

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
    for (let i = 0; i < this.strengthDice; i++) {
      this.activeDice.push({ type: AttackType.Strength, value: diceRoll() });
    }

    for (let i = 0; i < this.holyDice; i++) {
      this.activeDice.push({ type: AttackType.Holy, value: diceRoll() });
    }

    eventUpdater.fire("dice-update");

    this.toStage(RoundStage.B_ResolveSiege);
  }

  getColumnIndex(card: BattlefieldCard) {
    return this.battlefield.findIndex((col) => col.includes(card));
  }

  private setupBattlefield() {
    const battlefield: BattlefieldCard[][] = [];

    // There are 5 columns on the battlefield
    for (let col = 0; col < 5; col++) {
      const column: BattlefieldCard[] = [];

      // Put 4 troops in first 4 spots
      for (let i = 0; i < 4; i++) {
        column.push(this.troopDeck.pop());
      }

      // Seige engine at the top in last spot
      column.push(this.siegeDeck.pop());

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
