import { ReactElement } from "react";
import { SiegeEngineCard } from "../../app-state/types";
import "./siege-card.scss";
import { useEventUpdater } from "../hooks/use-event-updater";
import { useGameState } from "../game-state-context";
import { TokensDisplay } from "../tokens-display/tokens-display";

interface SiegeCardProps {
  card: SiegeEngineCard;
}

export function SiegeCard({ card }: SiegeCardProps) {
  const gameState = useGameState();
  useEventUpdater("resolve-siege-engines", "siege-engine-update");

  const isActive = gameState.currentlyResolvingSiegeEngine === card;
  const isQueued = gameState.siegeEnginesToResolve.includes(card);

  const isValidChoice =
    gameState.pendingSiegeSelection?.validChoices.includes(card);

  function onClick() {
    if (isValidChoice) {
      gameState.pendingSiegeSelection?.onSelect(card);
    } else if (isQueued) {
      gameState.beginResolveSiegeEngine(card);
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

  const cardClasses = [
    "siege-card",
    isActive || isValidChoice ? "highlight-active" : "",
    isQueued ? "highlight-queued" : "",
  ];

  if (card.magicTokens) console.log("got magic tokens", card.magicTokens);

  return (
    <div className={cardClasses.join(" ")} onClick={onClick}>
      <div className="body">
        <div className="ranges">{ranges}</div>
        {card.magicTokens && <TokensDisplay magicTokens={card.magicTokens} />}
        <div className="name">{card.name}</div>
      </div>
      <div className="effect-bar">{card.effect}</div>
    </div>
  );
}
