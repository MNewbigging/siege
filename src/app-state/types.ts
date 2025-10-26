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
  type: AttackType;
  effect: string;
  // isSeigeTower ?
  toDefeatA: DiceValue;
  toDefeatB?: DiceValue;
}

export interface SiegeEngineCard {
  name: string;
  effect: string;
  healthPerRow: number[]; // top-down, starts at 5 ends at 1/V
  activeOnRows: number[]; // V = 1
}

export type BattlefieldCard = SiegeEngineCard | TroopCard | undefined;
