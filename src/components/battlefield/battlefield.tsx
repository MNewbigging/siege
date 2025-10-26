import { GameState } from "../../app-state/game-state";
import { BattlefieldCard } from "../../app-state/types";
import { EnemyCard } from "../enemy-card/enemy-card";
import "./battlefield.scss";

interface BattlefieldProps {
  gameState: GameState;
}

export function Battlefield({ gameState }: BattlefieldProps) {
  // A column for every array in the battlefield
  const columns = gameState.battlefield.map((column, index) => (
    <BattlefieldColumn key={`column-${index}`} column={column} colIdx={index} />
  ));

  return <div className="battlefield">{columns}</div>;
}

interface BattlefieldColumnProps {
  column: BattlefieldCard[];
  colIdx: number;
}

function BattlefieldColumn({ column, colIdx }: BattlefieldColumnProps) {
  // A card display for every entry in the column cards
  const cards = column.map((card, index) => (
    <div
      key={`column-${colIdx}-${card?.name}-${index}`}
      className="enemy-card-area"
    >
      <EnemyCard card={card} />
    </div>
  ));

  return <div className="column">{cards}</div>;
}
