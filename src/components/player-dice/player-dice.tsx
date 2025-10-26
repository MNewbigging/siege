import { GameState } from "../../app-state/game-state";
import "./player-dice.scss";

interface PlayerDiceProps {
  gameState: GameState;
}

export function PlayerDice({ gameState }: PlayerDiceProps) {
  return <div className="player-dice"></div>;
}

function RollPrompt() {
  return <div className="roll-prompt">ROLL</div>;
}
