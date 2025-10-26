import { GameState } from "../../app-state/game-state";
import { RoundStage } from "../../app-state/types";
import { DiceDisplay } from "../dice-display/dice-display";
import { useEventUpdater } from "../hooks/use-event-updater";
import "./player-dice.scss";

interface PlayerDiceProps {
  gameState: GameState;
}

export function PlayerDice({ gameState }: PlayerDiceProps) {
  useEventUpdater("rolled-dice");

  if (gameState.roundStage === RoundStage.A_RollDice)
    return <RollPrompt onRoll={() => gameState.rollPlayerDice()} />;

  const dice = gameState.activeDice.map((dice, index) => (
    <DiceDisplay key={`player-dice-display-${index}`} dice={dice} />
  ));

  return <div className="player-dice">{dice}</div>;
}

interface RollPromptProps {
  onRoll: () => void;
}

function RollPrompt({ onRoll }: RollPromptProps) {
  return (
    <div className="roll-prompt">
      <div className="roll-button" onClick={onRoll}>
        ROLL DICE
      </div>
    </div>
  );
}
