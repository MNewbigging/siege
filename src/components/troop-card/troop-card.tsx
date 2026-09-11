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

  const classes = ["troop-card", isValidChoice ? "active" : ""];

  return (
    <div className={classes.join(" ")} onClick={onClick}>
      <div className="body">
        <div className="dice-reqs">
          <DiceReq dice={card.toDefeatA} />
          {card.toDefeatB && <DiceReq dice={card.toDefeatB} />}
        </div>
        {card.strengthTokens && (
          <TokensDisplay strengthTokens={card.strengthTokens} />
        )}
        <div className="name">{card.name}</div>
      </div>
      <div className="effect-bar">{card.effect}</div>
    </div>
  );
}
