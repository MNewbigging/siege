import { SiegeEngineCard } from "./types";

// There are 2 of each siege engine card
export const siegeEngineCards: SiegeEngineCard[] = [
  {
    name: "Catapult",
    effect: "Reroll one 6",
    healthPerRow: [14, 14, 14, 12, 10],
    activeOnRows: [1, 2, 3],
  },
  {
    name: "Ballista",
    effect: "Forfeit one Dice and one Champion",
    healthPerRow: [14, 14, 14, 14, 10],
    activeOnRows: [1, 2],
  },
  {
    name: "Flaming Rain",
    effect: "Discard one Champion. Flip one Champion",
    healthPerRow: [14, 14, 12, 14, 10],
    activeOnRows: [1, 3, 5],
  },
  {
    name: "Gargan's Eye",
    effect: "Spend one Strengh dice and one Magic dice",
    healthPerRow: [14, 13, 13, 13, 14],
    activeOnRows: [2, 3, 4],
  },
  {
    name: "Breach Tower",
    effect: "Load in one adjacent Troop card",
    healthPerRow: [14, 14, 14, 8, 8],
    activeOnRows: [1, 2],
  },
  {
    name: "Trebuchet",
    effect: "Add Damage to the Turret below",
    healthPerRow: [14, 13, 14, 13, 12],
    activeOnRows: [1, 2, 3, 4],
  },
  {
    name: "Spinblade",
    effect: "Spend one Dice. Reroll one 4",
    healthPerRow: [12, 14, 12, 12, 14],
    activeOnRows: [2, 3, 5],
  },
  {
    name: "Ogre's Reach",
    effect: "Add 2 Damage to the Turret below",
    healthPerRow: [14, 14, 14, 12, 10],
    activeOnRows: [1, 2],
  },
  {
    name: "Battering Ram",
    effect: "Lower each Strength die by 1",
    healthPerRow: [14, 14, 14, 14, 14],
    activeOnRows: [1],
  },
  {
    name: "Incendiaries",
    effect: "Reroll one 5",
    healthPerRow: [14, 13, 12, 11, 10],
    activeOnRows: [1, 2, 3, 4, 57],
  },
];
