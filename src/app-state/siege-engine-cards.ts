import { SiegeEngineCard, SiegeEngineEffect } from "./types";

// There are 2 of each siege engine card
export const siegeEngineCards: SiegeEngineCard[] = [
  {
    name: "Catapult",
    effect: SiegeEngineEffect.Catapult,
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
    effect: SiegeEngineEffect.Ballista,
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
    effect: SiegeEngineEffect.FlamingRain,
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
    effect: SiegeEngineEffect.GargansEye,
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
    effect: SiegeEngineEffect.BreachTower,
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
    effect: SiegeEngineEffect.Trebuchet,
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
    effect: SiegeEngineEffect.OgresReach,
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
    effect: SiegeEngineEffect.BatteringRam,
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
    effect: SiegeEngineEffect.Incendiaries,
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
    effect: SiegeEngineEffect.Spinblade,
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
