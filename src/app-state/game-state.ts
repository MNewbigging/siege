import { eventUpdater } from "../events/event-updater";
import { EventCard, EventCardName } from "./event-cards";
import {
  makeEventDeck,
  makeSiegeDeck,
  makeTroopDeck,
  makeTurrets,
} from "./setup-utils";
import {
  AttackType,
  BattlefieldCard,
  Dice,
  RoundStage,
  SiegeEngineCard,
  ITroopCard,
  SiegeEngineEffect,
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

  private strengthDice: number;
  private holyDice: number;

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

    // Then being to resolve the siege card
    switch (siegeCard.effect) {
      case SiegeEngineEffect.Ballista:
        this.setupDiceForfeitRequest(() => {
          this.setupChampionDiscardRequest(this.finishResolveSiegeEngine);
        });
        break;
      case SiegeEngineEffect.BatteringRam:
        // Lowers each strength dice by 1
        this.activeDice.forEach((dice) => {
          if (dice.type === AttackType.Strength && dice.value > 1) dice.value--;
        });
        eventUpdater.fire("dice-update");
        this.finishResolveSiegeEngine();
        break;
      case SiegeEngineEffect.BreachTower:
        // todo
        break;
      case SiegeEngineEffect.Catapult:
        this.setupDiceRerollRequest(6, this.finishResolveSiegeEngine);
        break;
      case SiegeEngineEffect.FlamingRain:
        this.setupChampionDiscardRequest(() => {
          this.setupChampionFlipRequest(this.finishResolveSiegeEngine);
        });
        break;
      case SiegeEngineEffect.GargansEye:
        this.setupDiceSpendRequest({
          type: AttackType.Strength,
          onComplete: () => {
            this.setupDiceSpendRequest({
              type: AttackType.Holy,
              onComplete: this.finishResolveSiegeEngine,
            });
          },
        });
        break;
      case SiegeEngineEffect.Incendiaries:
        this.setupDiceRerollRequest(5, this.finishResolveSiegeEngine);
        break;
      case SiegeEngineEffect.OgresReach:
        {
          const columnIndex = this.getColumnIndex(siegeCard);
          this.turrets[columnIndex].flames += 2;
          eventUpdater.fire("turret-update");
          if (this.turrets[columnIndex].flames >= 4) this.gameOver();
          else this.finishResolveSiegeEngine();
        }
        break;
      case SiegeEngineEffect.Spinblade:
        this.setupDiceSpendRequest({
          onComplete: () => {
            this.setupDiceRerollRequest(4, this.finishResolveSiegeEngine);
          },
        });
        break;
      case SiegeEngineEffect.Trebuchet:
        // Get column, then add a flame to turret
        {
          const columnIndex = this.getColumnIndex(siegeCard);
          this.turrets[columnIndex].flames++;
          eventUpdater.fire("turret-update");
          // Check for game over
          if (this.turrets[columnIndex].flames >= 4) this.gameOver();
          else this.finishResolveSiegeEngine();
        }
        break;
      default:
        break;
    }
  }

  beginResolveEventCard() {
    if (!this.currentlyResolvingEventCard) return;

    // Can the event be resolved at all?
    switch (this.currentlyResolvingEventCard.name) {
      case EventCardName.DangerousVisions:
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

  private getColumnIndex(card: BattlefieldCard) {
    return this.battlefield.findIndex((col) => col.includes(card));
  }

  private finishResolveSiegeEngine = () => {
    this.currentlyResolvingSiegeEngine = undefined;
    eventUpdater.fire("resolve-siege-engines");

    // Was this the last one to resolve?
    if (!this.siegeEnginesToResolve.length)
      this.toStage(RoundStage.C_ResolveEvent);
  };

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

  private toStage(nextStage: RoundStage) {
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
        this.currentlyResolvingEventCard = this.eventDeck.pop();
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

  private setupDiceRerollRequest(
    valueToReroll: number,
    onComplete: () => void,
  ) {
    // If there's not an active dice of the given value to reroll, complete
    const hasActiveDiceOfValue = this.activeDice.some(
      (dice) => dice.value === valueToReroll,
    );
    if (!hasActiveDiceOfValue) {
      onComplete();
      return;
    }

    const onSelect = (dice: Dice) => {
      if (dice.value !== valueToReroll)
        throw new Error("Not the requested reroll dice value");

      dice.value = diceRoll();

      eventUpdater.fire("dice-update");
      this.pendingDiceSelection = undefined;

      onComplete();
    };

    this.pendingDiceSelection = { mustMatchValue: valueToReroll, onSelect };
    eventUpdater.fire("dice-update");
  }

  private setupDiceForfeitRequest(onComplete: () => void) {
    // This shouldn't happen but just in case there are no dice to forfeit
    if (!this.activeDice.length) {
      onComplete();
      return;
    }

    const onSelect = (dice: Dice) => {
      // Forfeit dice are removed from the active pool
      this.activeDice = this.activeDice.filter(
        (activeDice) => activeDice !== dice,
      );
      if (dice.type === AttackType.Strength) this.strengthDice--;
      else this.holyDice--;
      this.pendingDiceSelection = undefined;
      eventUpdater.fire("dice-update");
      onComplete();
    };

    this.pendingDiceSelection = { onSelect };
    eventUpdater.fire("dice-update");
  }

  private setupDiceSpendRequest(options: {
    type?: AttackType;
    onComplete: () => void;
  }) {
    const { type, onComplete } = options;

    // If given a type, ensure there are active dice of that type
    const eligibleDice = type
      ? this.activeDice.filter((d) => d.type === type)
      : this.activeDice;

    if (!eligibleDice.length) {
      onComplete();
      return;
    }

    const onSelect = (dice: Dice) => {
      // Move to spent pool
      this.activeDice = this.activeDice.filter((d) => d !== dice);
      this.spentDice.push(dice);

      this.pendingDiceSelection = undefined;
      eventUpdater.fire("dice-update");
      onComplete();
    };

    this.pendingDiceSelection = { onSelect };
    eventUpdater.fire("dice-update");
  }

  private setupChampionDiscardRequest(onComplete: () => void) {
    // In case there are no champions to discard
    if (!this.activeChampions.length) {
      onComplete();
      return;
    }

    const onSelect = (champion: Champion) => {
      // Move this champion to discards
      this.activeChampions = this.activeChampions.filter(
        (ch) => ch !== champion,
      );
      this.championDiscardDeck.push(champion);
      this.pendingChampionSelection = undefined;
      eventUpdater.fire("champion-update");
      onComplete();
    };

    this.pendingChampionSelection = { canBeFlipped: true, onSelect };
    eventUpdater.fire("champion-update");
  }

  private setupChampionFlipRequest(onComplete: () => void) {
    // If there is no champion available to flip
    const unflippedChampions = this.activeChampions.some((ch) => !ch.flipped);
    if (!unflippedChampions) {
      onComplete();
      return;
    }

    const onSelect = (champion: Champion) => {
      // Flip this champion
      champion.flipped = true;
      this.pendingChampionSelection = undefined;
      eventUpdater.fire("champion-update");
      onComplete();
    };

    this.pendingChampionSelection = { canBeFlipped: false, onSelect };
    eventUpdater.fire("champion-update");
  }

  private gameOver() {
    console.log("game over!");
  }
}
