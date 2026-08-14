import { useGameState } from "../game-state-context";
import { useEventUpdater } from "../hooks/use-event-updater";
import "./player-info.scss";

export function PlayerInfo() {
  const gameState = useGameState();
  useEventUpdater("round-stage-update");

  return (
    <div className="player-info">
      <div>
        Round {gameState.currentRound} of {gameState.maxRounds}
      </div>
      <div>Stage: {gameState.roundStage}</div>
    </div>
  );
}
