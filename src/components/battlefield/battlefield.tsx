import { EnemyCard } from "../enemy-card/enemy-card";
import "./battlefield.scss";

export function Battlefield() {
  return (
    <div className="battlefield">
      <BattlefieldColumn />
      <BattlefieldColumn />
      <BattlefieldColumn />
      <BattlefieldColumn />
      <BattlefieldColumn />
    </div>
  );
}

function BattlefieldColumn() {
  return (
    <div className="column">
      <div className="enemy-card-area">
        <EnemyCard />
      </div>
      <div className="enemy-card-area">
        <EnemyCard />
      </div>
      <div className="enemy-card-area">
        <EnemyCard />
      </div>
      <div className="enemy-card-area">
        <EnemyCard />
      </div>
      <div className="enemy-card-area">
        <EnemyCard />
      </div>
    </div>
  );
}
