import { BattlefieldCard } from "../../app-state/types";
import "./enemy-card.scss";

interface EnemyCardProps {
  card: BattlefieldCard;
}

export function EnemyCard({ card }: EnemyCardProps) {
  return <div className="enemy-card">{card?.name}</div>;
}
