import { ReactElement } from "react";
import { SiegeEngineCard } from "../../app-state/types";
import "./siege-card.scss";
import { useEventUpdater } from "../hooks/use-event-updater";
import { useGameState } from "../game-state-context";
import { TokensDisplay } from "../tokens-display/tokens-display";
import { DiceDisplay } from "../dice-display/dice-display";

interface SiegeCardProps {
  card: SiegeEngineCard;
}

export function SiegeCard({ card }: SiegeCardProps) {
  const gameState = useGameState();
  useEventUpdater("siege-engine-update", "planned-dice-update");

  const isValidChoice =
    gameState.pendingSiegeSelection?.validChoices.includes(card);

  function onClick() {
    if (isValidChoice) {
      gameState.pendingSiegeSelection?.onSelect(card);
    }
  }

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    // Get normalised dorp position on card
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;

    const diceId = event.dataTransfer.getData("text/plain");
    gameState.dropDiceOnCard(diceId, { x, y }, card);
  }

  const plannedDice = gameState.pendingDicePlan.get(card);
  const plannedDiceDisplays = plannedDice?.map((planned) => (
    <div
      key={`planned-dice-${planned.dice.id}`}
      style={{
        position: "absolute",
        zIndex: 1,
        transform: "translate(-50%, -50%)",
        left: `${planned.pos.x * 100}%`,
        top: `${planned.pos.y * 100}%`,
      }}
    >
      <DiceDisplay dice={planned.dice} />
    </div>
  ));

  const cardClasses = ["siege-card", isValidChoice ? "highlight-active" : ""];

  return (
    <div
      className={cardClasses.join(" ")}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {plannedDiceDisplays}
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
