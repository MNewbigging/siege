import { useEffect, useRef, useState } from "react";
import { useGameState } from "../game-state-context";
import { TroopCard } from "../../app-state/types";
import { useItemDrag } from "../item-drag-context";
import { useEventUpdater } from "../hooks/use-event-updater";
import "./player-hand.scss";

type GlowColor = "success" | "failure" | null;

export function PlayerHand() {
  const gameState = useGameState();
  const handElement = useRef<HTMLDivElement>(null);
  const { registerDropTarget } = useItemDrag();
  const [glowColor, setGlowColor] = useState<GlowColor>(null);
  useEventUpdater("battlefield-card-defeated");

  useEffect(() => {
    const element = handElement.current;
    if (!element) return;
    return registerDropTarget(element, (item) => {
      if (item.type === "card") {
        const canDefeat = gameState.canCardBeDefeated(item.card);
        setGlowColor(canDefeat ? "success" : "failure");

        if (canDefeat) gameState.defeatCard(item.card);

        const timer = setTimeout(() => setGlowColor(null), 2000);
        return () => clearTimeout(timer);
      }
    });
  }, [gameState, registerDropTarget]);

  const classes = ["player-hand", glowColor ? `glow-${glowColor}` : ""];

  const thumbnails = gameState.playerHand.map((card, index) => (
    <CardThumb key={`card-thumb-${index}`} card={card} />
  ));

  return (
    <div ref={handElement} className={classes.join(" ")}>
      {thumbnails}
    </div>
  );
}

interface CardThumbProps {
  card: TroopCard;
}

function CardThumb({ card }: CardThumbProps) {
  return <div className="card-thumb">{card.effect}</div>;
}
