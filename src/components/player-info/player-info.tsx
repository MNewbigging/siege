import { GameState } from "../../app-state/game-state";
import { useEventUpdater } from "../hooks/use-event-updater";
import "./player-info.scss";

interface PlayerInfoProps {
  gameState: GameState;
}

export function PlayerInfo({ gameState }: PlayerInfoProps) {
  useEventUpdater("rolled-dice");

  return (
    <div className="player-info">
      <div>
        Round {gameState.currentRound} of {gameState.maxRounds}
      </div>
      <div>Stage: {gameState.roundStage}</div>
    </div>
  );
}
