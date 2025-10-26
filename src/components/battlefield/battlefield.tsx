import { ReactElement } from "react";
import { GameState } from "../../app-state/game-state";
import {
  BattlefieldCard,
  isSiegeCard,
  isTroopCard,
  ITroopCard,
} from "../../app-state/types";
import { EmptyCard } from "../empty-card/empty-card";
import { EnemyCard } from "../enemy-card/enemy-card";
import { SiegeCard } from "../siege-card/siege-card";
import { TroopCard } from "../troop-card/troop-card";
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
  let cards: ReactElement[] = [];

  // Use the correct component for each card type
  column.forEach((card) => {
    if (!card) {
      cards.push(<EmptyCard />);
    }

    if (isTroopCard(card)) {
      cards.push(<TroopCard card={card} />);
    }

    if (isSiegeCard(card)) {
      cards.push(<SiegeCard card={card} />);
    }
  });

  // Wrap each card in a container styled by this comp
  cards = cards.map((cardComp, index) => (
    <div key={`${colIdx}-${index}`} className="enemy-card-area">
      {cardComp}
    </div>
  ));

  return <div className="column">{cards}</div>;
}
