import type { TroopCard } from "../../app-state/types";
import { DiceDisplay } from "../dice-display/dice-display";
import { DiceReq } from "../dice-req/dice-req";
import { useGameState } from "../game-state-context";
import { useEventUpdater } from "../hooks/use-event-updater";
import { TokensDisplay } from "../tokens-display/tokens-display";
import "./troop-card.scss";

interface TroopCardProps {
  card: TroopCard;
}

export function TroopCard({ card }: TroopCardProps) {
  useEventUpdater("troop-update", "planned-dice-update");

  const gameState = useGameState();
  const isValidChoice =
    gameState.pendingTroopSelection?.validChoices.includes(card);

  function onClick() {
    if (isValidChoice) {
      gameState.pendingTroopSelection?.onSelect(card);
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

  const classes = ["troop-card", isValidChoice ? "active" : ""];

  const plannedDice = gameState.pendingDiceSpend.get(card);
  const plannedDiceDisplays = plannedDice?.map((plannedDice) => (
    <div
      key={`planned-dice-${plannedDice.dice.id}`}
      style={{
        position: "absolute",
        zIndex: 1,
        transform: "translate(-50%, -50%)",
        left: `${plannedDice.pos.x * 100}%`,
        top: `${plannedDice.pos.y * 100}%`,
      }}
    >
      <DiceDisplay dice={plannedDice.dice} />
    </div>
  ));

  return (
    <div
      className={classes.join(" ")}
      onClick={onClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {plannedDiceDisplays}
      <div className="body">
        <div className="dice-reqs">
          <DiceReq
            type={card.diceToDefeatA.type}
            value={card.diceToDefeatA.value}
          />
          {card.diceToDefeatB && (
            <DiceReq
              type={card.diceToDefeatB.type}
              value={card.diceToDefeatB.value}
            />
          )}
        </div>
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
