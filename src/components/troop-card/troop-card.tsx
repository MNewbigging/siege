import { useEffect, useRef } from "react";
import type { TroopCard } from "../../app-state/types";
import { AttackType, RoundStage } from "../../app-state/types";
import { DiceDisplay } from "../dice-display/dice-display";
import { useItemDrag } from "../item-drag-context";
import { useGameState } from "../game-state-context";
import { useEventUpdater } from "../hooks/use-event-updater";
import { TokensDisplay } from "../tokens-display/tokens-display";
import "./troop-card.scss";

interface TroopCardProps {
  card: TroopCard;
}

export function TroopCard({ card }: TroopCardProps) {
  useEventUpdater("troop-update", "planned-dice-update");

  const gameState = useGameState();
  const { isActiveDragItem, startDrag } = useItemDrag();
  const isValidChoice =
    gameState.pendingTroopSelection?.validChoices.includes(card);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (gameState.roundStage !== RoundStage.D_Action) return;
    if ((event.target as HTMLElement).closest(".dice-display")) return;
    startDrag({ type: "card", card }, event);
  }

  function onClick() {
    if (isValidChoice) {
      gameState.pendingTroopSelection?.onSelect(card);
    }
  }

  const classes = [
    "troop-card",
    isValidChoice ? "active" : "",
    isActiveDragItem({ type: "card", card }) ? "dragging-source" : "",
  ];

  return (
    <div
      className={classes.join(" ")}
      onClick={onClick}
      onPointerDown={handlePointerDown}
    >
      <div className="body">
        <div className="dice-reqs">
          <DiceReqZone card={card} requirement={card.diceToDefeatA} />
          {card.diceToDefeatB && (
            <DiceReqZone card={card} requirement={card.diceToDefeatB} />
          )}
        </div>
        {(card.magicTokens || card.strengthTokens) && (
          <TokensDisplay
            magicTokens={card.magicTokens}
            strengthTokens={card.strengthTokens}
          />
        )}
        <div className="name">{card.name}</div>
      </div>
      <div className="effect-bar">{card.effect}</div>
    </div>
  );
}

interface DiceReqZoneProps {
  card: TroopCard;
  requirement: TroopCard["diceToDefeatA"];
}

function DiceReqZone({ card, requirement }: DiceReqZoneProps) {
  const gameState = useGameState();
  const zoneElement = useRef<HTMLDivElement>(null);
  const { activeDrag, registerDropTarget } = useItemDrag();
  const { type, value } = requirement;
  const plannedDice = (gameState.pendingDicePlan.get(card) ?? []).filter(
    (planned) => (planned.requirementType ?? AttackType.Strength) === type,
  );
  const total = plannedDice.reduce(
    (sum, planned) => sum + planned.dice.value,
    0,
  );
  const hasRequiredType = plannedDice.some(
    (planned) => planned.dice.type === type,
  );
  const isComplete = total >= value && hasRequiredType;
  const draggedDice =
    activeDrag?.isDragging && activeDrag.item.type === "dice"
      ? activeDrag.item.dice
      : undefined;
  const canAcceptDice =
    type === AttackType.Strength || draggedDice?.type === AttackType.Holy;

  useEffect(() => {
    const element = zoneElement.current;
    if (!element) return;
    return registerDropTarget(element, (item, pos) => {
      if (item.type !== "dice") return;
      gameState.dropDiceOnCard(item.dice.id, pos, card, type);
    });
  }, [card, gameState, registerDropTarget, type]);

  const classes = [
    "dice-req-zone",
    type,
    isComplete ? "complete" : "",
    draggedDice ? (canAcceptDice ? "accepting" : "rejecting") : "",
  ];

  return (
    <div
      ref={zoneElement}
      className={classes.join(" ")}
      aria-label={`${type} requirement: ${total} of ${value}`}
      title={
        type === AttackType.Strength && !hasRequiredType
          ? "Requires at least one strength die"
          : `${type} requirement: ${total} / ${value}`
      }
    >
      <div className="zone-heading">
        <span>{type === AttackType.Holy ? "Holy" : "Strength"}</span>
        <span className="zone-total">
          {total} / {value}
        </span>
      </div>
      <div className="zone-dice">
        {plannedDice.map((planned) => (
          <DiceDisplay key={planned.dice.id} dice={planned.dice} />
        ))}
      </div>
    </div>
  );
}
