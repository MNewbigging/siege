import { appState } from "../app-state/app-state";
import "./app.scss";
import { Battlefield } from "./battlefield/battlefield";
import { useEventUpdater } from "./hooks/use-event-updater";
import { MainMenu } from "./main-menu/main-menu";
import { PlayerBar } from "./player-bar/player-bar";
import { TowerWall } from "./tower-wall/tower-wall";

export function App() {
  useEventUpdater("game-started");

  if (!appState.gameState) return <MainMenu />;

  return (
    <div className="ui-root">
      <Battlefield gameState={appState.gameState} />
      <TowerWall />
      <PlayerBar />
    </div>
  );
}
