import { ReactElement } from "react";
import { SiegeEngineCard } from "../../app-state/types";
import "./siege-card.scss";
import { useEventUpdater } from "../hooks/use-event-updater";
import { useGameState } from "../game-state-context";

interface SiegeCardProps {
  card: SiegeEngineCard;
}

export function SiegeCard({ card }: SiegeCardProps) {
  const gameState = useGameState();
  useEventUpdater("resolve-siege-engines");

  // If this is one of the sieges to resolve, highlight it
  const shouldResolve = gameState.siegeEnginesToResolve.includes(card);
  const cardClasses = ["siege-card", shouldResolve ? "highlight" : ""];

  function onClick() {
    if (shouldResolve) {
      gameState.resolveSiegeEngine(card);
    }
  }

  // Construct the ranges block
  const ranges: ReactElement[] = [];
  card.rowData.forEach((rowData) => {
    const classes = ["range", rowData.isActive ? "active" : ""].join(" ");
    ranges.push(
      <div key={`range-${rowData.rowIndex}`} className={classes}>
        {rowData.health}
      </div>,
    );
  });

  return (
    <div className={cardClasses.join(" ")} onClick={onClick}>
      <div className="body">
        <div className="ranges">{ranges}</div>
        <div className="name">{card.name}</div>
      </div>
      <div className="effect-bar">{card.effect}</div>
    </div>
  );
}
