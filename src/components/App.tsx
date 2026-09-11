import { appState } from "../app-state/app-state";
import { GameStateProvider } from "./game-state-context";
import "./app.scss";
import { Battlefield } from "./battlefield/battlefield";
import { useEventUpdater } from "./hooks/use-event-updater";
import { MainMenu } from "./main-menu/main-menu";
import { PlayerBar } from "./player-bar/player-bar";
import { TowerWall } from "./tower-wall/tower-wall";
import { EventCardManager } from "./event-card/event-card-manager";
import { EventCardBrowser } from "./event-card-browser/event-card-browser";
import { TroopCardBrowser } from "./troop-card-browser/troop-card-browser";

export function App() {
  useEventUpdater("game-started");

  if (!appState.gameState) return <MainMenu />;

  return (
    <GameStateProvider value={appState.gameState}>
      <div className="ui-root">
        <Battlefield />
        <TowerWall />
        <PlayerBar />
      </div>
      <EventCardManager />
      <TroopCardBrowser />
      <EventCardBrowser />
    </GameStateProvider>
  );
}
