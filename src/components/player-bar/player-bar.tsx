import { GameState } from "../../app-state/game-state";
import { PlayerDice } from "../player-dice/player-dice";
import { PlayerHand } from "../player-hand/player-hand";
import { PlayerInfo } from "../player-info/player-info";
import "./player-bar.scss";

interface PlayerBarProps {
  gameState: GameState;
}

export function PlayerBar({ gameState }: PlayerBarProps) {
  return (
    <div className="player-bar">
      <PlayerDice gameState={gameState} />
      <PlayerHand gameState={gameState} />
      <PlayerInfo gameState={gameState} />
    </div>
  );
}
