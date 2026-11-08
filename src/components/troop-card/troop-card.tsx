import { useEffect, useRef } from "react";
import type { TroopCard } from "../../app-state/types";
import { RoundStage } from "../../app-state/types";
import { DiceDisplay } from "../dice-display/dice-display";
import { useItemDrag } from "../item-drag-context";
import { DiceReq } from "../dice-req/dice-req";
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
  const cardElement = useRef<HTMLDivElement>(null);
  const { isActiveDragItem, registerDropTarget, startDrag } = useItemDrag();
  const isValidChoice =
    gameState.pendingTroopSelection?.validChoices.includes(card);

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
      gameState.pendingTroopSelection?.onSelect(card);
    }
  }

  const classes = [
    "troop-card",
    isValidChoice ? "active" : "",
    isActiveDragItem({ type: "card", card }) ? "dragging-source" : "",
  ];

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

  return (
    <div
      ref={cardElement}
      className={classes.join(" ")}
      onClick={onClick}
      onPointerDown={handlePointerDown}
    >
      {plannedDiceDisplays}
      <div className="body">
        <div className="dice-reqs">
          <DiceReq
            type={card.diceToDefeatA.type}
            value={card.diceToDefeatA.value}
          />
          {card.diceToDefeatB && (
            <DiceReq
              type={card.diceToDefeatB.type}
              value={card.diceToDefeatB.value}
            />
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
