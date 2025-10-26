import "./app.scss";
import { EnemyGrid } from "./enemy-grid/enemy-grid";
import { PlayerBar } from "./player-bar/player-bar";
import { TowerWall } from "./tower-wall/tower-wall";

export function App() {
  return (
    <div className="ui-root">
      <EnemyGrid />
      <TowerWall />
      <PlayerBar />
    </div>
  );
}
