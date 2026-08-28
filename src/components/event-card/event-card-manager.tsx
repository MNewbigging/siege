import { useGameState } from "../game-state-context";
import { useEventUpdater } from "../hooks/use-event-updater";
import { EventCard } from "./event-card";
import "./event-card-manager.scss";

export function EventCardManager() {
  useEventUpdater("event-update");
  const gameState = useGameState();

  // Check game-state for current card to show
  const eventCard = gameState.currentlyResolvingEventCard;
  if (!eventCard) return null;

  // Bring to middle of screen, enlarged
  return (
    <div className="event-card-manager">
      <EventCard eventCard={eventCard} />;
    </div>
  );

  // Await touch on screen

  // Move card above tower wall (tap/hover brings it back into middle enlarged)

  // Begin resolve card effect
}
