import { Dice } from "../../app-state/types";
import "./dice-req.scss";

interface DiceReqProps {
  dice: Dice;
}

export function DiceReq({ dice }: DiceReqProps) {
  const classes = ["dice-req", dice.type].join(" ");

  return <div className={classes}>{dice.value}</div>;
}
