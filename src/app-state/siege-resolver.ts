import { eventUpdater } from "../events/event-updater";
import type { GameState } from "./game-state";
import {
  AttackType,
  Champion,
  Dice,
  isSiegeCard,
  RoundStage,
  SiegeEngineCard,
  SiegeEngineEffect,
} from "./types";
import { diceRoll } from "./utils";

export class SiegeResolver {
  private siegeEnginesToResolve: SiegeEngineCard[] = [];

  constructor(private gameState: GameState) {}

  resolveEngines() {
    this.siegeEnginesToResolve = this.getSiegeEnginesToResolve();
    this.setupNextSiegeToResolve();
  }

  private resolve(siegeCard: SiegeEngineCard) {
    switch (siegeCard.effect) {
      case SiegeEngineEffect.Ballista:
        this.setupDiceForfeitRequest(() => {
          this.setupChampionDiscardRequest(this.finishResolveSiegeEngine);
        });
        break;
      case SiegeEngineEffect.BatteringRam:
        // Lowers each strength dice by 1
        this.gameState.activeDice.forEach((dice) => {
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
          const columnIndex = this.gameState.getColumnIndex(siegeCard);
          this.gameState.turrets[columnIndex].flames += 2;
          eventUpdater.fire("turret-update");
          if (this.gameState.turrets[columnIndex].flames >= 4)
            this.gameState.gameOver();
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
          const columnIndex = this.gameState.getColumnIndex(siegeCard);
          this.gameState.turrets[columnIndex].flames++;
          eventUpdater.fire("turret-update");
          // Check for game over
          if (this.gameState.turrets[columnIndex].flames >= 4)
            this.gameState.gameOver();
          else this.finishResolveSiegeEngine();
        }
        break;
      default:
        break;
    }
  }

  private getSiegeEnginesToResolve() {
    const toResolve: SiegeEngineCard[] = [];
    this.gameState.battlefield.forEach((col) => {
      col.forEach((rowCard, rowIndex) => {
        if (isSiegeCard(rowCard) && rowCard.rowData[rowIndex].isActive) {
          toResolve.push(rowCard);
        }
      });
    });

    return toResolve;
  }

  private setupNextSiegeToResolve() {
    const leftmost = this.siegeEnginesToResolve.shift();
    if (!leftmost) {
      this.gameState.toStage(RoundStage.C_ResolveEvent);
      return;
    }

    this.gameState.pendingSiegeSelection = {
      validChoices: [leftmost],
      onSelect: (siegeCard) => this.resolve(siegeCard),
    };
    eventUpdater.fire("siege-engine-update");
  }

  private finishResolveSiegeEngine = () => {
    // Done with the current siege selection
    this.gameState.pendingSiegeSelection = undefined;
    eventUpdater.fire("siege-engine-update");

    // Was this the last one to resolve?
    if (!this.siegeEnginesToResolve.length) {
      this.gameState.toStage(RoundStage.C_ResolveEvent);
      return;
    }

    // Otherwise, prep the next one
    this.setupNextSiegeToResolve();
  };

  private setupDiceForfeitRequest(onComplete: () => void) {
    // This shouldn't happen but just in case there are no dice to forfeit
    if (!this.gameState.activeDice.length) {
      onComplete();
      return;
    }

    const onSelect = (dice: Dice) => {
      // Forfeit dice are removed from the active pool
      this.gameState.activeDice = this.gameState.activeDice.filter(
        (activeDice) => activeDice !== dice,
      );

      if (dice.type === AttackType.Strength) this.gameState.strengthDice--;
      else this.gameState.holyDice--;

      this.gameState.pendingDiceSelection = undefined;
      eventUpdater.fire("dice-update");
      onComplete();
    };

    this.gameState.pendingDiceSelection = { onSelect };
    eventUpdater.fire("dice-update");
  }

  private setupDiceSpendRequest(options: {
    type?: AttackType;
    onComplete: () => void;
  }) {
    const { type, onComplete } = options;

    // If given a type, ensure there are active dice of that type
    const eligibleDice = type
      ? this.gameState.activeDice.filter((d) => d.type === type)
      : this.gameState.activeDice;

    if (!eligibleDice.length) {
      onComplete();
      return;
    }

    const onSelect = (dice: Dice) => {
      // Move to spent pool
      this.gameState.activeDice = this.gameState.activeDice.filter(
        (d) => d !== dice,
      );
      this.gameState.spentDice.push(dice);

      this.gameState.pendingDiceSelection = undefined;
      eventUpdater.fire("dice-update");
      onComplete();
    };

    this.gameState.pendingDiceSelection = { onSelect };
    eventUpdater.fire("dice-update");
  }

  private setupDiceRerollRequest(
    valueToReroll: number,
    onComplete: () => void,
  ) {
    // If there's not an active dice of the given value to reroll, complete
    const hasActiveDiceOfValue = this.gameState.activeDice.some(
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
      this.gameState.pendingDiceSelection = undefined;

      onComplete();
    };

    this.gameState.pendingDiceSelection = {
      mustMatchValue: valueToReroll,
      onSelect,
    };
    eventUpdater.fire("dice-update");
  }

  private setupChampionFlipRequest(onComplete: () => void) {
    // If there is no champion available to flip
    const unflippedChampions = this.gameState.activeChampions.some(
      (ch) => !ch.flipped,
    );
    if (!unflippedChampions) {
      onComplete();
      return;
    }

    const onSelect = (champion: Champion) => {
      // Flip this champion
      champion.flipped = true;
      this.gameState.pendingChampionSelection = undefined;
      eventUpdater.fire("champion-update");
      onComplete();
    };

    this.gameState.pendingChampionSelection = { canBeFlipped: false, onSelect };
    eventUpdater.fire("champion-update");
  }

  private setupChampionDiscardRequest(onComplete: () => void) {
    // In case there are no champions to discard
    if (!this.gameState.activeChampions.length) {
      onComplete();
      return;
    }

    const onSelect = (champion: Champion) => {
      // Move this champion to discards
      this.gameState.activeChampions = this.gameState.activeChampions.filter(
        (ch) => ch !== champion,
      );
      this.gameState.championDiscardDeck.push(champion);
      this.gameState.pendingChampionSelection = undefined;
      eventUpdater.fire("champion-update");
      onComplete();
    };

    this.gameState.pendingChampionSelection = { canBeFlipped: true, onSelect };
    eventUpdater.fire("champion-update");
  }
}
