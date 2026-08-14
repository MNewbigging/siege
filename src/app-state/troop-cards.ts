import { AttackType, ITroopCard } from "./types";

// There are 5 of each Strength troop, and 3 of each Magic troop
export const allTroopCards: ITroopCard[] = [
  {
    name: "Troll Brute",
    type: AttackType.Strength,
    effect: "Change one dice to 6",
    toDefeatA: { type: AttackType.Strength, value: 7 },
  },
  {
    name: "Rune Witch",
    type: AttackType.Holy,
    effect: "Reroll any number of unused dice",
    toDefeatA: { type: AttackType.Holy, value: 2 },
    toDefeatB: { type: AttackType.Strength, value: 2 },
  },
  {
    name: "Red Witch",
    type: AttackType.Holy,
    effect: "Gain and roll one Magic dice. Gain one champion.",
    toDefeatA: { type: AttackType.Holy, value: 3 },
    toDefeatB: { type: AttackType.Strength, value: 4 },
  },
  {
    name: "Orc archer",
    type: AttackType.Strength,
    effect: "Gain and roll one Strength dice",
    toDefeatA: { type: AttackType.Strength, value: 6 },
  },
  {
    name: "Gargoyle Talon",
    type: AttackType.Strength,
    effect: "Attack any non-Front card",
    toDefeatA: { type: AttackType.Strength, value: 4 },
  },
  {
    name: "Dragonkin Warlord",
    type: AttackType.Strength,
    effect: "Double the value of one Dice",
    toDefeatA: { type: AttackType.Strength, value: 4 },
  },
  {
    name: "Gnoll Pack",
    type: AttackType.Strength,
    effect: "Flip one Dice to its opposite side",
    toDefeatA: { type: AttackType.Strength, value: 5 },
  },
  {
    name: "Efreet Enflamme",
    type: AttackType.Holy,
    effect: "Spend +2 Magic to overkill an adjacent Siege engine",
    toDefeatA: { type: AttackType.Holy, value: 4 },
    toDefeatB: { type: AttackType.Strength, value: 5 },
  },
  {
    name: "Undead Samurai",
    type: AttackType.Holy,
    effect: "Swap two adjacent cards",
    toDefeatA: { type: AttackType.Holy, value: 3 },
    toDefeatB: { type: AttackType.Strength, value: 3 },
  },
  {
    name: "Goblin warrior",
    type: AttackType.Strength,
    effect: "+1 or -1 to one dice",
    toDefeatA: { type: AttackType.Strength, value: 3 },
  },
  {
    name: "Lycan Mage",
    type: AttackType.Holy,
    effect: "Spend +2 Strength to overkill an adj card",
    toDefeatA: { type: AttackType.Holy, value: 4 },
    toDefeatB: { type: AttackType.Strength, value: 4 },
  },
  {
    name: "Gargan Priest",
    type: AttackType.Holy,
    effect: "Block the effect of one Siege",
    toDefeatA: { type: AttackType.Holy, value: 2 },
    toDefeatB: { type: AttackType.Strength, value: 3 },
  },
];
