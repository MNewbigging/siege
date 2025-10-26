import { ISiegeEngineCard } from "../../app-state/types";

interface SiegeCardProps {
  card: ISiegeEngineCard;
}

export function SiegeCard({ card }: SiegeCardProps) {
  return <div className="siege-card">{card.name}</div>;
}
