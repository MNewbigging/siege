import { ReactElement } from "react";
import { ISiegeEngineCard } from "../../app-state/types";
import "./siege-card.scss";
import { useEventUpdater } from "../hooks/use-event-updater";
import { useGameState } from "../game-state-context";

interface SiegeCardProps {
  card: ISiegeEngineCard;
}

export function SiegeCard({ card }: SiegeCardProps) {
  useGameState();
  useEventUpdater("rolled-dice");

  // If

  // Construct the ranges block
  const ranges: ReactElement[] = [];
  card.healthPerRow.forEach((health, index) => {
    const activeClass = card.activeOnRows.includes(index + 1) ? "active" : "";
    const classes = ["range", activeClass].join(" ");
    ranges.push(
      <div key={`health-${index}`} className={classes}>
        {health}
      </div>,
    );
  });

  return (
    <div className="siege-card">
      <div className="body">
        <div className="ranges">{ranges}</div>
        <div className="name">{card.name}</div>
      </div>
      <div className="effect-bar">{card.effect}</div>
    </div>
  );
}
