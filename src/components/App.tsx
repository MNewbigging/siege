import "./app.scss";
import { Battlefield } from "./battlefield/battlefield";
import { PlayerBar } from "./player-bar/player-bar";
import { TowerWall } from "./tower-wall/tower-wall";

export function App() {
  return (
    <div className="ui-root">
      <Battlefield />
      <TowerWall />
      <PlayerBar />
    </div>
  );
}
