import { Tower } from "../tower/tower";
import "./tower-wall.scss";

export function TowerWall() {
  return (
    <div className="tower-wall">
      <Tower />
      <Tower />
      <Tower />
      <Tower />
      <Tower />
    </div>
  );
}
