import { eventUpdater } from "../events/event-updater";
import { GameState } from "./game-state";

class AppState {
  gameState?: GameState;

  start() {
    this.gameState = new GameState();
    eventUpdater.fire("game-started");
  }
}

export const appState = new AppState();
