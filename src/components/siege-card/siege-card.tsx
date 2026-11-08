import { ReactElement, useEffect, useRef } from "react";
import { RoundStage, SiegeEngineCard } from "../../app-state/types";
import "./siege-card.scss";
import { useEventUpdater } from "../hooks/use-event-updater";
import { useGameState } from "../game-state-context";
import { useItemDrag } from "../item-drag-context";
import { TokensDisplay } from "../tokens-display/tokens-display";
import { DiceDisplay } from "../dice-display/dice-display";

interface SiegeCardProps {
  card: SiegeEngineCard;
}

export function SiegeCard({ card }: SiegeCardProps) {
  const gameState = useGameState();
  const cardElement = useRef<HTMLDivElement>(null);
  const { isActiveDragItem, registerDropTarget, startDrag } = useItemDrag();
  useEventUpdater("siege-engine-update", "planned-dice-update");

  const isValidChoice =
    gameState.pendingSiegeSelection?.validChoices.includes(card);

  useEffect(() => {
    const element = cardElement.current;
    if (!element) return;
    return registerDropTarget(element, (item, pos) => {
      if (item.type === "dice")
        gameState.dropDiceOnCard(item.dice.id, pos, card);
    });
  }, [card, gameState, registerDropTarget]);

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (gameState.roundStage !== RoundStage.D_Action) return;
    startDrag({ type: "card", card }, event);
  }

  function onClick() {
    if (isValidChoice) {
      gameState.pendingSiegeSelection?.onSelect(card);
    }
  }

  const plannedDice = gameState.pendingDicePlan.get(card);
  const plannedDiceDisplays = plannedDice?.map((planned) => (
    <div
      key={`planned-dice-${planned.dice.id}`}
      style={{
        position: "absolute",
        zIndex: 1,
        transform: "translate(-50%, -50%)",
        left: `${planned.pos.x * 100}%`,
        top: `${planned.pos.y * 100}%`,
      }}
    >
      <DiceDisplay dice={planned.dice} />
    </div>
  ));

  const cardClasses = [
    "siege-card",
    isValidChoice ? "highlight-active" : "",
    isActiveDragItem({ type: "card", card }) ? "dragging-source" : "",
  ];

  return (
    <div
      ref={cardElement}
      className={cardClasses.join(" ")}
      onClick={onClick}
      onPointerDown={handlePointerDown}
    >
      {plannedDiceDisplays}
      <div className="body">
        <RangesBlock card={card} />
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

interface RangesBlockProps {
  card: SiegeEngineCard;
}

function RangesBlock({ card }: RangesBlockProps) {
  const ranges: ReactElement[] = [];
  card.rowData.forEach((rowData) => {
    const classes = ["range", rowData.isActive ? "active" : ""].join(" ");
    ranges.push(
      <div key={`range-${rowData.rowIndex}`} className={classes}>
        {rowData.health}
      </div>,
    );
  });

  return <div className="ranges">{ranges}</div>;
}
