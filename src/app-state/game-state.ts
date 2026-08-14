import { eventUpdater } from "../events/event-updater";
import { makeSiegeDeck, makeTroopDeck } from "./setup-utils";
import {
  AttackType,
  BattlefieldCard,
  Dice,
  RoundStage,
  SiegeEngineCard,
  ITroopCard,
  SiegeEngineEffect,
  isSiegeCard,
} from "./types";
import { diceRoll } from "./utils";
("./siege-engine-cards");

interface PendingDiceSelection {
  value: number;
  onSelect: (dice: Dice) => void;
}

export class GameState {
  currentRound = 1;
  maxRounds = 7;
  roundStage: RoundStage = RoundStage.A_RollDice;

  siegeDeck: SiegeEngineCard[];
  troopDeck: ITroopCard[];
  playerHand: ITroopCard[];
  battlefield: BattlefieldCard[][] = []; // by column, index 0 is front/vanguard
  activeDice: Dice[] = [];
  spentDice: Dice[] = [];

  // Transient
  siegeEnginesToResolve: SiegeEngineCard[] = [];
  currentlyResolvingSiegeEngine?: SiegeEngineCard;
  pendingDiceSelection?: PendingDiceSelection;

  private strengthDice: number;
  private magicDice: number;

  constructor() {
    // Setup
    this.siegeDeck = makeSiegeDeck();
    const troopDeck = makeTroopDeck();
    this.playerHand = troopDeck.splice(-2);
    this.troopDeck = troopDeck;

    this.battlefield = this.setupBattlefield();

    this.strengthDice = 3;
    this.magicDice = 2;
  }

  rollPlayerDice() {
    for (let i = 0; i < this.strengthDice; i++) {
      this.activeDice.push({ type: AttackType.Strength, value: diceRoll() });
    }

    // Testing incendiaries
    this.activeDice[0].value = 5;

    for (let i = 0; i < this.magicDice; i++) {
      this.activeDice.push({ type: AttackType.Holy, value: diceRoll() });
    }

    eventUpdater.fire("rolled-dice");

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
        break;
      case SiegeEngineEffect.BatteringRam:
        break;
      case SiegeEngineEffect.BreachTower:
        break;
      case SiegeEngineEffect.Catapult:
        if (this.hasActiveDiceOfValue(6))
          this.setupRerollRequest(6, () => this.finishResolveSiegeEngine());
        else {
          // No 6s to reroll, can immediately resolve this siege engine
          this.finishResolveSiegeEngine();
        }
        break;
      case SiegeEngineEffect.FlamingRain:
        break;
      case SiegeEngineEffect.GargansEye:
        break;
      case SiegeEngineEffect.Incendiaries:
        if (this.hasActiveDiceOfValue(5))
          this.setupRerollRequest(5, () => this.finishResolveSiegeEngine());
        else {
          // No 5s to reroll, can immediately resolve this siege engine
          this.finishResolveSiegeEngine();
        }
        break;
      case SiegeEngineEffect.OgresReach:
        break;
      case SiegeEngineEffect.Spinblade:
        break;
      case SiegeEngineEffect.Trebuchet:
        break;
      default:
        break;
    }
  }

  private finishResolveSiegeEngine() {
    this.currentlyResolvingSiegeEngine = undefined;
    eventUpdater.fire("resolve-siege-engines");
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

        this.roundStage = nextStage;
        eventUpdater.fire("resolve-siege-engines");

        break;
      case RoundStage.C_ResolveEvent:
        // Draw random event, show it
        // Resolve effect
        // Move on
        break;
    }
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

  private hasActiveDiceOfValue(value: number) {
    return this.activeDice.some((dice) => dice.value === value);
  }

  private setupRerollRequest(toReroll: number, onComplete: () => void) {
    // Siege engines can request a reroll of a single 4/5/6
    const onSelect = (dice: Dice) => {
      const newValue = diceRoll();
      dice.value = newValue;
      eventUpdater.fire("rolled-dice");
      this.pendingDiceSelection = undefined;
      onComplete();
    };

    this.pendingDiceSelection = { value: toReroll, onSelect };
    eventUpdater.fire("dice-update");
  }
}
