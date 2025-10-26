export enum AttackType {
  Strength = "strength",
  Magic = "magic",
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

export enum RoundStage {
  A_RollDice = "Rolling dice",
  B_ResolveSiege = "Resolving Siege engines",
  C_ResolveEvent = "Resolving an Event card",
  D_Action = "Performing player actions",
  E_Vanguard = "Activating vanguard",
  F_Advance = "Advancing battlefield",
  G_Reinforce = "Reinforcing battlefield",
}

/**

  GAME FLOW CONSISTS OF 7 ROUNDS OF:
  1) Roll dice
  2) Resolve Siege engines
  3) Resolve an event
  4) Perform player actions
  5) Activate vanguard
  6) Advance battlefield
  7) Reinforce battlefield


  I want to be able to undo all actions within a round.
  Valid undo actions:
  - spending dice to complete a card
  - using a player card ability
  - using a champion ability
*/
