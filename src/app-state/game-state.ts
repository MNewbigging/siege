import { eventUpdater } from "../events/event-updater";
import { siegeEngineCards } from "./siege-engine-cards";
import { allTroopCards } from "./troop-cards";
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
import { diceRoll, getCountOfAttackType, shuffleArray } from "./utils";
("./siege-engine-cards");

interface PendingDiceSelection {
  validValues: number[];
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
  pendingDiceSelection?: PendingDiceSelection;

  private strengthDice: number;
  private magicDice: number;

  constructor() {
    // Setup
    this.siegeDeck = this.makeSiegeDeck();
    const troopDeck = this.makeTroopDeck();
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

    for (let i = 0; i < this.magicDice; i++) {
      this.activeDice.push({ type: AttackType.Holy, value: diceRoll() });
    }

    eventUpdater.fire("rolled-dice");

    this.toStage(RoundStage.B_ResolveSiege);
  }

  resolveSiegeEngine(siegeCard: SiegeEngineCard) {
    switch (siegeCard.effect) {
      case SiegeEngineEffect.Ballista:
        break;
      case SiegeEngineEffect.BatteringRam:
        break;
      case SiegeEngineEffect.BreachTower:
        break;
      case SiegeEngineEffect.Catapult:
        this.resolveCatapult();
        break;
      case SiegeEngineEffect.FlamingRain:
        break;
      case SiegeEngineEffect.GargansEye:
        break;
      case SiegeEngineEffect.Incendiaries:
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

  private makeSiegeDeck() {
    const siegeDeck: SiegeEngineCard[] = [];

    siegeEngineCards.forEach((card) => {
      // Each card is doubled
      for (let copy = 0; copy < 2; copy++) {
        siegeDeck.push({
          ...card,
          rowData: card.rowData.map((row) => ({ ...row })),
        });
      }
    });

    // Shuffled
    shuffleArray(siegeDeck);

    // Then remove 5
    siegeDeck.length = 13;

    return siegeDeck;
  }

  private makeTroopDeck() {
    const troopDeck: ITroopCard[] = [];

    allTroopCards.forEach((card) => {
      const count = getCountOfAttackType(card.type);

      for (let i = 0; i < count; i++) {
        troopDeck.push({
          ...card,
          toDefeatA: { ...card.toDefeatA },
          toDefeatB: card.toDefeatB ? { ...card.toDefeatB } : undefined,
        });
      }
    });

    // Shuffle
    shuffleArray(troopDeck);

    // Remove 2
    troopDeck.length = 46;

    return troopDeck;
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

  private resolveCatapult() {
    // Reroll a 6

    // If there aren't any 6s we can stop early
    const sixes = this.activeDice.filter((die) => die.value === 6);
    if (!sixes.length) return true;

    // The player needs to select a 6 to reroll
    const onSelect = (dice: Dice) => {
      // Reroll this dice
      const newValue = diceRoll();
      dice.value = newValue;
      eventUpdater.fire("rolled-dice");
      this.pendingDiceSelection = undefined;
    };

    this.pendingDiceSelection = { validValues: [6], onSelect };
  }
}
