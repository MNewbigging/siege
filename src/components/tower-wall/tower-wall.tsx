import { useGameState } from "../game-state-context";
import { Tower } from "../tower/tower";
import "./tower-wall.scss";

export function TowerWall() {
  const gameState = useGameState();

  return (
    <div className="tower-wall">
      {gameState.turrets.map((turret, index) => (
        <Tower key={`turret-${index}`} turret={turret} />
      ))}
    </div>
  );
}
