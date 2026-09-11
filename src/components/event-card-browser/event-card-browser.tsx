import { DragEvent, useEffect, useState } from "react";
import { EventCard as EventCardData } from "../../app-state/event-cards";
import { EventCard } from "../event-card/event-card";
import { useGameState } from "../game-state-context";
import { useEventUpdater } from "../hooks/use-event-updater";
import "./event-card-browser.scss";

export function EventCardBrowser() {
  useEventUpdater("event-browser-update");

  const gameState = useGameState();
  const browserRequest = gameState.pendingEventCardBrowser;
  const [orderedCards, setOrderedCards] = useState<EventCardData[]>([]);
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
    <div className="event-card-browser">
      <div className="browser-panel">
        <div className="browser-header">
          <div>
            <div className="eyebrow">Foresight</div>
            <h2>Return event cards in any order</h2>
          </div>
          <button
            className="confirm-button"
            type="button"
            onClick={() => browserRequest.onAccept(orderedCards)}
          >
            Accept
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
              <EventCard eventCard={card} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function reorderCards(
  cards: EventCardData[],
  sourceIndex: number,
  targetIndex: number,
) {
  if (sourceIndex === targetIndex) return cards;

  const nextCards = cards.slice();
  const [movedCard] = nextCards.splice(sourceIndex, 1);
  nextCards.splice(targetIndex, 0, movedCard);

  return nextCards;
}
