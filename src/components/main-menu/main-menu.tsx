import { appState } from "../../app-state/app-state";
import "./main-menu.scss";

export function MainMenu() {
  return (
    <div className="main-menu">
      <div className="start-button" onClick={() => appState.start()}>
        Start
      </div>
    </div>
  );
}
