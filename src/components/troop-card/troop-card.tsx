import type { TroopCard } from "../../app-state/types";
import { DiceReq } from "../dice-req/dice-req";
import { useGameState } from "../game-state-context";
import { useEventUpdater } from "../hooks/use-event-updater";
import { TokensDisplay } from "../tokens-display/tokens-display";
import "./troop-card.scss";

interface TroopCardProps {
  card: TroopCard;
}

export function TroopCard({ card }: TroopCardProps) {
  useEventUpdater("troop-update");

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

  const classes = ["troop-card", isValidChoice ? "active" : ""];

  return (
    <div
      className={classes.join(" ")}
      onClick={onClick}
      onDragOver={handleDragOver}
    >
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
