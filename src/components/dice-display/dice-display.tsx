import { Dice, RoundStage } from "../../app-state/types";
import { useGameState } from "../game-state-context";
import { useEventUpdater } from "../hooks/use-event-updater";
import "./dice-display.scss";

interface DiceDisplayProps {
  dice: Dice;
  shadow?: boolean;
}

export function DiceDisplay({ dice, shadow }: DiceDisplayProps) {
  useEventUpdater("round-stage-update");
  const gameState = useGameState();

  // If there is a pending dice selection, highlight if this dice is valid for selection
  const selection = gameState.pendingDiceSelection;

  const isValidSelection = !!selection?.validChoices.includes(dice);

  function onClick() {
    if (isValidSelection) {
      selection?.onSelect(dice);
    }
  }

  function handleDragStart(event: React.DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData("text/plain", dice.id);
    event.dataTransfer.effectAllowed = "move";
  }

  const diceClass = [
    "dice-display",
    dice.type,
    isValidSelection ? "highlight" : "",
    shadow ? "shadow" : "",
  ].join(" ");

  return (
    <div
      className={diceClass}
      onClick={onClick}
      onDragStart={handleDragStart}
      draggable={!shadow && gameState.roundStage === RoundStage.D_Action}
    >
      {dice.value}
    </div>
  );
}
