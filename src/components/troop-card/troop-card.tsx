import { ITroopCard } from "../../app-state/types";
import { DiceReq } from "../dice-req/dice-req";
import "./troop-card.scss";

interface TroopCardProps {
  card: ITroopCard;
}

export function TroopCard({ card }: TroopCardProps) {
  return (
    <div className="troop-card">
      <div className="body">
        <div className="dice-reqs">
          <DiceReq dice={card.toDefeatA} />
          {card.toDefeatB && <DiceReq dice={card.toDefeatB} />}
        </div>
        <div className="name">{card.name}</div>
      </div>
      <div className="effect-bar">{card.effect}</div>
    </div>
  );
}
