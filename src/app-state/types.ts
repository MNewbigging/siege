export enum AttackType {
  Strength = "strength",
  Holy = "holy",
}

export interface Dice {
  type: AttackType;
  value: number;
}

export interface TroopCard {
  name: string;
  type: AttackType;
  effect: string;
  toDefeatA: Dice;
  toDefeatB?: Dice;
  magicTokens?: number;
  strengthTokens?: number;
}

export function isTroopCard(card: any): card is TroopCard {
  return "toDefeatA" in card;
}

export interface SiegeEngineRowData {
  rowIndex: number; // 0 is the bottom row closest to walls
  health: number; // at this row position
  isActive: boolean; // at this row position
}

export enum SiegeEngineEffect {
  Catapult = "Reroll one 6",
  Ballista = "Forfeit one die and one champion",
  Spinblade = "Spend one die. Reroll one 4",
  BatteringRam = "Lower each Strength die by 1",
  OgresReach = "Add 2 flame to the Turret below",
  Incendiaries = "Reroll one 5",
  BreachTower = "Load in one adjacent Troop card",
  FlamingRain = "Discard one Champion. Flip one Champion.",
  Trebuchet = "Add 1 flame to the Turret below",
  GargansEye = "Spend one Strength die and one Holy die",
}

export interface SiegeEngineCard {
  name: string;
  effect: SiegeEngineEffect;
  rowData: SiegeEngineRowData[];
  magicTokens?: number;
  strengthTokens?: number;
}

export function isSiegeCard(card: any): card is SiegeEngineCard {
  return "rowData" in card;
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

export interface Champion {
  name: string;
  flipped: boolean;
}

export interface Turret {
  flames: number;
}

/**

  GAME FLOW CONSISTS OF 7 ROUNDS OF:
  1) Roll dice and flip champions face up
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
