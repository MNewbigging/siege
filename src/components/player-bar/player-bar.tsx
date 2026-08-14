import { PlayerDice } from "../player-dice/player-dice";
import { PlayerHand } from "../player-hand/player-hand";
import { PlayerInfo } from "../player-info/player-info";
import "./player-bar.scss";

export function PlayerBar() {
  return (
    <div className="player-bar">
      <PlayerDice />
      <PlayerHand />
      <PlayerInfo />
    </div>
  );
}
