import { DragEvent, useEffect, useState } from "react";
import { ITroopCard } from "../../app-state/types";
import { useGameState } from "../game-state-context";
import { useEventUpdater } from "../hooks/use-event-updater";
import { TroopCard } from "../troop-card/troop-card";
import "./troop-card-browser.scss";

function reorderCards(
  cards: ITroopCard[],
  sourceIndex: number,
  targetIndex: number,
) {
  if (sourceIndex === targetIndex) return cards;

  const nextCards = cards.slice();
  const [movedCard] = nextCards.splice(sourceIndex, 1);
  nextCards.splice(targetIndex, 0, movedCard);

  return nextCards;
}

export function TroopCardBrowser() {
  useEventUpdater("troop-browser-update");

  const gameState = useGameState();
  const browserRequest = gameState.pendingTroopCardBrowser;
  const [orderedCards, setOrderedCards] = useState<ITroopCard[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | undefined>();

  useEffect(() => {
    setOrderedCards(browserRequest?.cards ?? []);
    setDraggedIndex(undefined);
  }, [browserRequest]);

  if (!browserRequest) return null;

  function handleDragStart(
    event: DragEvent<HTMLDivElement>,
    sourceIndex: number,
  ) {
    setDraggedIndex(sourceIndex);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", sourceIndex.toString());
  }

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>, targetIndex: number) {
    event.preventDefault();

    const transferredIndex = Number(event.dataTransfer.getData("text/plain"));
    const sourceIndex = draggedIndex ?? transferredIndex;

    if (!Number.isInteger(sourceIndex)) return;

    setOrderedCards((currentCards) =>
      reorderCards(currentCards, sourceIndex, targetIndex),
    );
    setDraggedIndex(undefined);
  }

  return (
    <div className="troop-card-browser">
      <div className="browser-panel">
        <div className="browser-header">
          <div>
            <div className="eyebrow">Dangerous Visions</div>
            <h2>Return troop cards in order</h2>
          </div>
          <button
            className="confirm-button"
            type="button"
            onClick={() => gameState.completeTroopCardBrowser(orderedCards)}
          >
            Return cards
          </button>
        </div>

        <div className="card-row">
          {orderedCards.map((card, cardIndex) => (
            <div
              className={[
                "browser-card",
                draggedIndex === cardIndex ? "dragging" : "",
              ].join(" ")}
              draggable
              key={`${card.name}-${cardIndex}`}
              onDragStart={(event) => handleDragStart(event, cardIndex)}
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, cardIndex)}
              onDragEnd={() => setDraggedIndex(undefined)}
            >
              <div className="position-label">
                {cardIndex === 0 ? "Top" : cardIndex + 1}
              </div>
              <TroopCard card={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
