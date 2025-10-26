import { GameState } from "../../app-state/game-state";
import "./player-info.scss";

interface PlayerInfoProps {
  gameState: GameState;
}

export function PlayerInfo({ gameState }: PlayerInfoProps) {
  return (
    <div className="player-info">
      <div>
        Round {gameState.currentRound} of {gameState.maxRounds}
      </div>
      <div>Stage: {gameState.roundStage}</div>
    </div>
  );
}
