import { AttackType, DiceValue } from "../../app-state/types";
import "./dice-display.scss";

interface DiceDisplayProps {
  dice: DiceValue;
}

export function DiceDisplay({ dice }: DiceDisplayProps) {
  const diceClass = ["dice-display", dice.type].join(" ");

  return <div className={diceClass}>{dice.value}</div>;
}
