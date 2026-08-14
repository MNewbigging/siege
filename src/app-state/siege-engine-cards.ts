import { ISiegeEngineCard } from "./types";

// There are 2 of each siege engine card
export const siegeEngineCards: ISiegeEngineCard[] = [
  {
    name: "Catapult",
    effect: "Reroll one 6",
    rowData: [
      {
        rowIndex: 0,
        health: 10,
        isActive: true,
      },
      {
        rowIndex: 1,
        health: 12,
        isActive: true,
      },
      {
        rowIndex: 2,
        health: 14,
        isActive: true,
      },
      {
        rowIndex: 3,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 4,
        health: 14,
        isActive: false,
      },
    ],
  },
  {
    name: "Ballista",
    effect: "Forfeit one Dice and one Champion",
    rowData: [
      {
        rowIndex: 0,
        health: 10,
        isActive: true,
      },
      {
        rowIndex: 1,
        health: 14,
        isActive: true,
      },
      {
        rowIndex: 2,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 3,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 4,
        health: 14,
        isActive: false,
      },
    ],
  },
  {
    name: "Flaming Rain",
    effect: "Discard one Champion. Flip one Champion",
    rowData: [
      {
        rowIndex: 0,
        health: 10,
        isActive: true,
      },
      {
        rowIndex: 1,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 2,
        health: 12,
        isActive: true,
      },
      {
        rowIndex: 3,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 4,
        health: 14,
        isActive: true,
      },
    ],
  },
  {
    name: "Gargan's Eye",
    effect: "Spend one Strengh dice and one Magic dice",
    rowData: [
      {
        rowIndex: 0,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 1,
        health: 13,
        isActive: true,
      },
      {
        rowIndex: 2,
        health: 13,
        isActive: true,
      },
      {
        rowIndex: 3,
        health: 13,
        isActive: true,
      },
      {
        rowIndex: 4,
        health: 14,
        isActive: false,
      },
    ],
  },
  {
    name: "Breach Tower",
    effect: "Load in one adjacent Troop card",
    rowData: [
      {
        rowIndex: 0,
        health: 8,
        isActive: true,
      },
      {
        rowIndex: 1,
        health: 8,
        isActive: true,
      },
      {
        rowIndex: 2,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 3,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 4,
        health: 14,
        isActive: false,
      },
    ],
  },
  {
    name: "Trebuchet",
    effect: "Add Damage to the Turret below",
    rowData: [
      {
        rowIndex: 0,
        health: 12,
        isActive: true,
      },
      {
        rowIndex: 1,
        health: 13,
        isActive: true,
      },
      {
        rowIndex: 2,
        health: 14,
        isActive: true,
      },
      {
        rowIndex: 3,
        health: 13,
        isActive: true,
      },
      {
        rowIndex: 4,
        health: 14,
        isActive: false,
      },
    ],
  },
  {
    name: "Ogre's Reach",
    effect: "Add 2 Damage to the Turret below",
    rowData: [
      {
        rowIndex: 0,
        health: 10,
        isActive: true,
      },
      {
        rowIndex: 1,
        health: 12,
        isActive: true,
      },
      {
        rowIndex: 2,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 3,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 4,
        health: 14,
        isActive: false,
      },
    ],
  },
  {
    name: "Battering Ram",
    effect: "Lower each Strength die by 1",
    rowData: [
      {
        rowIndex: 0,
        health: 14,
        isActive: true,
      },
      {
        rowIndex: 1,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 2,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 3,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 4,
        health: 14,
        isActive: false,
      },
    ],
  },
  {
    name: "Incendiaries",
    effect: "Reroll one 5",
    rowData: [
      {
        rowIndex: 0,
        health: 10,
        isActive: true,
      },
      {
        rowIndex: 1,
        health: 11,
        isActive: true,
      },
      {
        rowIndex: 2,
        health: 12,
        isActive: true,
      },
      {
        rowIndex: 3,
        health: 13,
        isActive: true,
      },
      {
        rowIndex: 4,
        health: 14,
        isActive: true,
      },
    ],
  },
  {
    name: "Spinblade",
    effect: "Spend one dice. Reroll one 4.",
    rowData: [
      {
        rowIndex: 0,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 1,
        health: 12,
        isActive: true,
      },
      {
        rowIndex: 2,
        health: 12,
        isActive: true,
      },
      {
        rowIndex: 3,
        health: 14,
        isActive: false,
      },
      {
        rowIndex: 4,
        health: 12,
        isActive: true,
      },
    ],
  },
];
