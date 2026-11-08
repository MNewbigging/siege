import { AttackType, Dice } from "../../app-state/types";
import "./dice-req.scss";

interface DiceReqProps {
  type: AttackType;
  value: number;
}

export function DiceReq({ type, value }: DiceReqProps) {
  const classes = ["dice-req", type].join(" ");

  return <div className={classes}>{value}</div>;
}
