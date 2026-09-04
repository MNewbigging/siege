import { type EventCard } from "../../app-state/event-cards";
import "./event-card.scss";

interface EventCardProps {
  eventCard: EventCard;
}

export function EventCard({ eventCard }: EventCardProps) {
  return (
    <div className="event-card">
      <div className="event-title">{eventCard.name}</div>
      <div className="event-todo">{eventCard.todoText}</div>
    </div>
  );
}
