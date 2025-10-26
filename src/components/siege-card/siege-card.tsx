import { ReactElement } from "react";
import { ISiegeEngineCard } from "../../app-state/types";
import "./siege-card.scss";

interface SiegeCardProps {
  card: ISiegeEngineCard;
}

export function SiegeCard({ card }: SiegeCardProps) {
  const ranges: ReactElement[] = [];

  card.healthPerRow.forEach((health, index) => {
    const activeClass = card.activeOnRows.includes(index + 1) ? "active" : "";
    const classes = ["range", activeClass].join(" ");

    ranges.push(<div className={classes}>{health}</div>);
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
