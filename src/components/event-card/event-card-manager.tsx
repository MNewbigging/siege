import { useEffect, useState } from "react";
import { useGameState } from "../game-state-context";
import { useEventUpdater } from "../hooks/use-event-updater";
import { EventCard } from "./event-card";
import "./event-card-manager.scss";

export function EventCardManager() {
  useEventUpdater("event-update");
  const gameState = useGameState();
  const [displayMode, setDisplayMode] = useState<
    "presenting" | "docked" | undefined
  >(undefined);

  // Check game-state for current card to show
  const eventCard = gameState.currentlyResolvingEventCard;

  useEffect(() => {
    // If the event card is there, we present it
    if (eventCard) setDisplayMode("presenting");
    // Otherwise it's been cleared so we reset
    else setDisplayMode(undefined);
  }, [eventCard]);

  if (!eventCard) return null;

  function onClickScreen() {
    if (displayMode !== "presenting") return;

    gameState.beginResolveEventCard();

    setDisplayMode("docked");
  }

  const classes = ["event-card-manager", displayMode].join(" ");

  return (
    <div className={classes} onClick={onClickScreen}>
      <EventCard eventCard={eventCard} />
    </div>
  );
}
