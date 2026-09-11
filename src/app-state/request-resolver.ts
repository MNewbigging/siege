import { eventUpdater } from "../events/event-updater";
import type { GameState } from "./game-state";
import { AttackType, Champion, Dice } from "./types";
import { diceRoll } from "./utils";

// Shared "pending selection" setups used by both SiegeResolver and EventResolver
export class RequestResolver {
  constructor(private gameState: GameState) {}

  setupDiceForfeitRequest(onComplete: () => void) {
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

  setupDiceSpendRequest(options: {
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

    this.gameState.pendingDiceSelection = { type, onSelect };
    eventUpdater.fire("dice-update");
  }

  setupDiceRerollRequest(valueToReroll: number, onComplete: () => void) {
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

  setupChampionFlipRequest(onComplete: () => void) {
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

  setupChampionDiscardRequest(onComplete: () => void) {
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
