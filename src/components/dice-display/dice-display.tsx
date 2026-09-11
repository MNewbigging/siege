import { Dice } from "../../app-state/types";
import { useGameState } from "../game-state-context";
import "./dice-display.scss";

interface DiceDisplayProps {
  dice: Dice;
}

export function DiceDisplay({ dice }: DiceDisplayProps) {
  const gameState = useGameState();

  // If there is a pending dice selection, highlight if this dice is valid for selection
  const selection = gameState.pendingDiceSelection;

  const isValidSelection =
    !!selection &&
    (!selection.type || selection.type === dice.type) &&
    (!selection.mustMatchValue || selection.mustMatchValue === dice.value);

  function onClick() {
    if (isValidSelection) {
      gameState.pendingDiceSelection?.onSelect(dice);
    }
  }

  const diceClass = [
    "dice-display",
    dice.type,
    isValidSelection ? "highlight" : "",
  ].join(" ");

  return (
    <div className={diceClass} onClick={onClick}>
      {dice.value}
    </div>
  );
}
