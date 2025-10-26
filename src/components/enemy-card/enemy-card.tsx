import { BattlefieldCard } from "../../app-state/types";
import "./enemy-card.scss";

interface EnemyCardProps {
  card: BattlefieldCard;
}

export function EnemyCard({ card }: EnemyCardProps) {
  if (!card) return <EmptyCardSlot />;

  return (
    <div className="enemy-card">
      <div className="left">
        <div className="dice-slot-a"></div>
      </div>
      <div className="right">
        <div className="name">{card.name}</div>
        <div className="effect">{card.effect}</div>
      </div>
    </div>
  );
}

function EmptyCardSlot() {
  return <div className="enemy-card empty"></div>;
}
