export enum AttackType {
  Strength,
  Magic,
}

export interface DiceValue {
  type: AttackType;
  value: number;
}

export interface TroopCard {
  name: string;
  effect: string;
  type: AttackType;
  // isSeigeTower ?
  toDefeatA: DiceValue;
  toDefeatB?: DiceValue;
}
