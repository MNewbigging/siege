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
  useEventUpdater("siege-engine-update");

  const isValidChoice =
    gameState.pendingSiegeSelection?.validChoices.includes(card);

  function onClick() {
    if (isValidChoice) {
      gameState.pendingSiegeSelection?.onSelect(card);
    }
  }

  const cardClasses = ["siege-card", isValidChoice ? "highlight-active" : ""];

  if (card.magicTokens) console.log("got magic tokens", card.magicTokens);

  return (
    <div className={cardClasses.join(" ")} onClick={onClick}>
      <div className="body">
        <RangesBlock card={card} />
        {(card.magicTokens || card.strengthTokens) && (
          <TokensDisplay
            magicTokens={card.magicTokens}
            strengthTokens={card.strengthTokens}
          />
        )}
        <div className="name">{card.name}</div>
      </div>
      <div className="effect-bar">{card.effect}</div>
    </div>
  );
}

interface RangesBlockProps {
  card: SiegeEngineCard;
}

function RangesBlock({ card }: RangesBlockProps) {
  const ranges: ReactElement[] = [];
  card.rowData.forEach((rowData) => {
    const classes = ["range", rowData.isActive ? "active" : ""].join(" ");
    ranges.push(
      <div key={`range-${rowData.rowIndex}`} className={classes}>
        {rowData.health}
      </div>,
    );
  });

  return <div className="ranges">{ranges}</div>;
}
