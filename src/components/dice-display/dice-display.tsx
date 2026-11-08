import { Dice, RoundStage } from "../../app-state/types";
import { useGameState } from "../game-state-context";
import { useEventUpdater } from "../hooks/use-event-updater";
import { useItemDrag } from "../item-drag-context";
import "./dice-display.scss";

interface DiceDisplayProps {
  dice: Dice;
  shadow?: boolean;
}

export function DiceDisplay({ dice, shadow }: DiceDisplayProps) {
  useEventUpdater("round-stage-update");
  const gameState = useGameState();
  const { isActiveDragItem, startDrag } = useItemDrag();

  // If there is a pending dice selection, highlight if this dice is valid for selection
  const selection = gameState.pendingDiceSelection;

  const isValidSelection = !!selection?.validChoices.includes(dice);

  function onClick() {
    if (isValidSelection) {
      selection?.onSelect(dice);
    }
    if (shadow) {
      gameState.unplanDice(dice);
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (shadow || gameState.roundStage !== RoundStage.D_Action) return;
    startDrag({ type: "dice", dice }, event);
  }

  const diceClass = [
    "dice-display",
    dice.type,
    isValidSelection ? "highlight" : "",
    shadow ? "shadow" : "",
    isActiveDragItem({ type: "dice", dice }) ? "dragging-source" : "",
  ].join(" ");

  return (
    <div
      className={diceClass}
      onClick={onClick}
      onPointerDown={handlePointerDown}
    >
      {dice.value}
    </div>
  );
}
