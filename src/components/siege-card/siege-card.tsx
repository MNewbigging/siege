import { ReactElement } from "react";
import { SiegeEngineCard, RoundStage } from "../../app-state/types";
import "./siege-card.scss";
import { useEventUpdater } from "../hooks/use-event-updater";
import { useGameState } from "../game-state-context";

interface SiegeCardProps {
  card: SiegeEngineCard;
  currentRow: number;
}

export function SiegeCard({ card, currentRow }: SiegeCardProps) {
  const gameState = useGameState();
  useEventUpdater("rolled-dice");

  // If it's time to resolve siege cards, highlight it
  const shouldHighlight =
    gameState.roundStage === RoundStage.B_ResolveSiege &&
    isOnActiveRow(card, currentRow);
  const cardClasses = ["siege-card", shouldHighlight ? "highlight" : ""];

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
    <div className={cardClasses.join(" ")}>
      <div className="body">
        <div className="ranges">{ranges}</div>
        <div className="name">{card.name}</div>
      </div>
      <div className="effect-bar">{card.effect}</div>
    </div>
  );
}

function isOnActiveRow(card: SiegeEngineCard, rowToCheck: number) {
  return card.rowData[rowToCheck].isActive;
}
