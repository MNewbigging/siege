import { useGameState } from "../game-state-context";
import { BattlefieldCard } from "../../app-state/types";
import "./player-hand.scss";

export function PlayerHand() {
  const gameState = useGameState();
  const thumbnails = gameState.playerHand.map((card, index) => (
    <CardThumb key={`card-thumb-${index}`} card={card} />
  ));

  return <div className="player-hand">{thumbnails}</div>;
}

interface CardThumbProps {
  card: BattlefieldCard;
}

function CardThumb({ card }: CardThumbProps) {
  if (!card) return null;

  return <div className="card-thumb">{card.effect}</div>;
}
