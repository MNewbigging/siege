import { ISiegeEngineCard } from "./types";

// There are 2 of each siege engine card
export const siegeEngineCards: ISiegeEngineCard[] = [
  {
    name: "Catapult",
    effect: "Reroll one 6",
    healthPerRow: [10, 12, 14, 14, 14],
    activeOnRows: [1, 2, 3],
  },
  {
    name: "Ballista",
    effect: "Forfeit one Dice and one Champion",
    healthPerRow: [10, 14, 14, 14, 14],
    activeOnRows: [1, 2],
  },
  {
    name: "Flaming Rain",
    effect: "Discard one Champion. Flip one Champion",
    healthPerRow: [10, 14, 12, 14, 14],
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
    healthPerRow: [8, 8, 14, 14, 14],
    activeOnRows: [1, 2],
  },
  {
    name: "Trebuchet",
    effect: "Add Damage to the Turret below",
    healthPerRow: [12, 13, 14, 13, 14],
    activeOnRows: [1, 2, 3, 4],
  },
  {
    name: "Ogre's Reach",
    effect: "Add 2 Damage to the Turret below",
    healthPerRow: [10, 12, 14, 14, 14],
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
    healthPerRow: [10, 11, 12, 13, 14],
    activeOnRows: [1, 2, 3, 4, 57],
  },
];
