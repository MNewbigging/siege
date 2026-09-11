import { eventUpdater } from "../events/event-updater";
import type { GameState } from "./game-state";
import { RequestResolver } from "./request-resolver";
import {
  AttackType,
  isSiegeCard,
  RoundStage,
  SiegeEngineCard,
  SiegeEngineEffect,
} from "./types";

export class SiegeResolver {
  private siegeEnginesToResolve: SiegeEngineCard[] = [];

  constructor(
    private gameState: GameState,
    private requestResolver: RequestResolver,
  ) {}

  resolveEngines() {
    this.siegeEnginesToResolve = this.getSiegeEnginesToResolve();
    this.setupNextSiegeToResolve();
  }

  resolve(siegeCard: SiegeEngineCard, onComplete: () => void) {
    switch (siegeCard.effect) {
      case SiegeEngineEffect.Ballista:
        this.requestResolver.setupDiceForfeitRequest(() => {
          this.requestResolver.setupChampionDiscardRequest(onComplete);
        });
        break;
      case SiegeEngineEffect.BatteringRam:
        // Lowers each strength dice by 1
        this.gameState.activeDice.forEach((dice) => {
          if (dice.type === AttackType.Strength && dice.value > 1) dice.value--;
        });
        eventUpdater.fire("dice-update");
        onComplete();
        break;
      case SiegeEngineEffect.BreachTower:
        // todo
        break;
      case SiegeEngineEffect.Catapult:
        this.requestResolver.setupDiceRerollRequest(6, onComplete);
        break;
      case SiegeEngineEffect.FlamingRain:
        this.requestResolver.setupChampionDiscardRequest(() => {
          this.requestResolver.setupChampionFlipRequest(onComplete);
        });
        break;
      case SiegeEngineEffect.GargansEye:
        this.requestResolver.setupDiceSpendRequest({
          type: AttackType.Strength,
          onComplete: () => {
            this.requestResolver.setupDiceSpendRequest({
              type: AttackType.Holy,
              onComplete,
            });
          },
        });
        break;
      case SiegeEngineEffect.Incendiaries:
        this.requestResolver.setupDiceRerollRequest(5, onComplete);
        break;
      case SiegeEngineEffect.OgresReach:
        {
          const columnIndex = this.gameState.getColumnIndex(siegeCard);
          this.gameState.turrets[columnIndex].flames += 2;
          eventUpdater.fire("turret-update");
          if (this.gameState.turrets[columnIndex].flames >= 4)
            this.gameState.gameOver();
          else onComplete();
        }
        break;
      case SiegeEngineEffect.Spinblade:
        this.requestResolver.setupDiceSpendRequest({
          onComplete: () => {
            this.requestResolver.setupDiceRerollRequest(4, onComplete);
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
          else onComplete();
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
      onSelect: (siegeCard) =>
        this.resolve(siegeCard, this.finishResolveSiegeEngine),
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
}
