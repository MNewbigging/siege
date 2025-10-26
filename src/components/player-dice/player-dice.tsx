import { GameState } from "../../app-state/game-state";
import { RoundStage } from "../../app-state/types";
import "./player-dice.scss";

interface PlayerDiceProps {
  gameState: GameState;
}

export function PlayerDice({ gameState }: PlayerDiceProps) {
  if (gameState.roundStage === RoundStage.A_RollDice)
    return <RollPrompt onRoll={() => gameState.rollPlayerDice()} />;

  return <div className="player-dice"></div>;
}

interface RollPromptProps {
  onRoll: () => void;
}

function RollPrompt({ onRoll }: RollPromptProps) {
  return (
    <div className="roll-prompt">
      <div className="roll-button">ROLL DICE</div>
    </div>
  );
}
