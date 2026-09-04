import { eventUpdater } from "../events/event-updater";
import { EventCard, EventCardName } from "./event-cards";
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
  isSiegeCard,
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

interface PendingTroopCardBrowser {
  cards: ITroopCard[];
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
  siegeEnginesToResolve: SiegeEngineCard[] = [];
  currentlyResolvingSiegeEngine?: SiegeEngineCard;
  pendingDiceSelection?: PendingDiceSelection;
  pendingChampionSelection?: PendingChampionSelection;
  currentlyResolvingEventCard?: EventCard;
  pendingTroopCardBrowser?: PendingTroopCardBrowser;

  strengthDice: number;
  holyDice: number;

  constructor() {
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

  beginResolveSiegeEngine(siegeCard: SiegeEngineCard) {
    // If currently resolving another card, stop
    if (this.currentlyResolvingSiegeEngine !== undefined) return;

    // Remove from array and keep in separate prop
    this.siegeEnginesToResolve = this.siegeEnginesToResolve.filter(
      (card) => card !== siegeCard,
    );
    this.currentlyResolvingSiegeEngine = siegeCard;
    eventUpdater.fire("resolve-siege-engines");

    const resolver = new SiegeResolver(this);
    resolver.resolve(siegeCard);
  }

  beginResolveEventCard() {
    if (!this.currentlyResolvingEventCard) return;

    // Can the event be resolved at all?
    switch (this.currentlyResolvingEventCard.name) {
      case EventCardName.DangerousVisions:
        this.setupTroopCardBrowser(6);
        break;
      case EventCardName.ShamansRitual:
        break;
      case EventCardName.LuckyShot:
        break;
      case EventCardName.GargansBlessing:
        break;
      case EventCardName.Deserter:
        break;
      case EventCardName.Foresight:
        break;
      case EventCardName.ShoreWalls:
        break;
      case EventCardName.AccidentsHappen:
        break;
      case EventCardName.FinalPush:
        break;
      case EventCardName.TurretShudders:
        break;
      case EventCardName.SpellSickness:
        break;
      case EventCardName.FoolsRush:
        break;
      case EventCardName.UnifiedRites:
        break;
      case EventCardName.FriendsArrive:
        break;
      case EventCardName.BackForMore:
        break;
      case EventCardName.CampCrud:
        break;
      case EventCardName.TrainedWarriors:
        break;
      case EventCardName.BattleLust:
        break;
    }
  }

  completeTroopCardBrowser(orderedCards: ITroopCard[]) {
    if (!this.pendingTroopCardBrowser) return;

    const browserCards = this.pendingTroopCardBrowser.cards;
    const isSameSet =
      orderedCards.length === browserCards.length &&
      orderedCards.every((card) => browserCards.includes(card));

    if (!isSameSet) throw new Error("Troop browser returned unexpected cards");

    const remainingDeck = this.troopDeck.slice(0, -browserCards.length);
    this.troopDeck = [...remainingDeck, ...orderedCards.slice().reverse()];
    this.pendingTroopCardBrowser = undefined;
    eventUpdater.fire("troop-browser-update");

    this.finishResolveEventCard();
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

  private setupTroopCardBrowser(cardCount: number) {
    const cards = this.troopDeck.slice(-cardCount).reverse();

    if (!cards.length) {
      this.finishResolveEventCard();
      return;
    }

    this.pendingTroopCardBrowser = { cards };
    eventUpdater.fire("troop-browser-update");
  }

  private finishResolveEventCard() {
    this.currentlyResolvingEventCard = undefined;
    eventUpdater.fire("event-update");
    this.toStage(RoundStage.D_Action);
  }

  toStage(nextStage: RoundStage) {
    switch (nextStage) {
      case RoundStage.A_RollDice:
        // Flip all champions
        // Await player rolling dice
        break;
      case RoundStage.B_ResolveSiege:
        // Determine engines to resolve
        this.siegeEnginesToResolve = this.getSiegeEnginesToResolve();

        // If there are none, can move onto next stage
        if (!this.siegeEnginesToResolve.length) {
          this.toStage(RoundStage.C_ResolveEvent);
          return; // Prevents continuing after above toStage is done
        }

        this.setStage(nextStage);
        eventUpdater.fire("resolve-siege-engines");

        break;
      case RoundStage.C_ResolveEvent:
        this.setStage(nextStage);
        if (!this.eventDeck.length) this.eventDeck = makeEventDeck();
        this.currentlyResolvingEventCard =
          this.eventDeck.find(
            (card) => card.name === EventCardName.DangerousVisions,
          ) ?? this.eventDeck.pop();
        eventUpdater.fire("event-update");

        // Resolve effect
        // Move on
        break;
    }
  }

  private setStage(stage: RoundStage) {
    this.roundStage = stage;
    eventUpdater.fire("round-stage-update");
  }

  private getSiegeEnginesToResolve() {
    const toResolve: SiegeEngineCard[] = [];
    this.battlefield.forEach((col) => {
      col.forEach((rowCard, rowIndex) => {
        if (isSiegeCard(rowCard) && rowCard.rowData[rowIndex].isActive) {
          toResolve.push(rowCard);
        }
      });
    });

    return toResolve;
  }

  gameOver() {
    console.log("game over!");
  }
}
