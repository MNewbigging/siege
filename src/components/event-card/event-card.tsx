import { type EventCard } from "../../app-state/types";

interface EventCardProps {
  eventCard: EventCard;
}

export function EventCard({ eventCard }: EventCardProps) {
  return <div className="event-card"></div>;
}
