export enum EventCardName {
  DangerousVisions = "Dangerous Visions",
  ShamansRitual = "Shaman's Ritual",
  LuckyShot = "Lucky Shot",
  GargansBlessing = "Gargan's Blessing",
  Deserter = "Deserter",
  Foresight = "Foresight",
  ShoreWalls = "Shore Up The Walls",
  AccidentsHappen = "Accidents Happen",
  FinalPush = "Final Push",
  TurretShudders = "The Turret Shudders",
  SpellSickness = "Spell Sickness",
  FoolsRush = "Fools Rush In",
  UnifiedRites = "Unified Rites",
  FriendsArrive = "Friends Arrive",
  BackForMore = "Back For More",
  CampCrud = "Camp Crud",
  TrainedWarriors = "Trained Warriors",
  BattleLust = "Battle Lust",
}

export interface EventCard {
  name: EventCardName;
  todoText: string;
  // flavourText: string;
}

export const eventCards: EventCard[] = [
  {
    name: EventCardName.DangerousVisions,
    todoText: "Look at the top six Troop cards, then return them in any order.",
  },
  {
    name: EventCardName.ShamansRitual,
    todoText: "Add 2 magic tokens to the farthest siege engine.",
  },
  {
    name: EventCardName.LuckyShot,
    todoText: "Activate one siege engine that is currently out of range.",
  },
  {
    name: EventCardName.GargansBlessing,
    todoText: "Add 2 magic tokens to the nearest siege engine.",
  },
  {
    name: EventCardName.Deserter,
    todoText: "Move one active strength dice to your dice pool.",
  },
  {
    name: EventCardName.Foresight,
    todoText: "Look at the top 3 event cards, then return them in any order.",
  },
  {
    name: EventCardName.ShoreWalls,
    todoText: "Remove all flames from one turret.",
  },
  {
    name: EventCardName.AccidentsHappen,
    todoText: "Flip 2 champions on your Fortress face-down.",
  },
  {
    name: EventCardName.FinalPush,
    todoText: "Add 2 strength tokens to the closest siege engine.",
  },
  {
    name: EventCardName.TurretShudders,
    todoText: "Add 1 flame to a turret with less than 3 flames",
  },
  {
    name: EventCardName.SpellSickness,
    todoText: "Move one active holy dice to your spent dice pool.",
  },
  {
    name: EventCardName.FoolsRush,
    todoText:
      "Add 2 strength tokens to the weakest strength troop in the Vanguard.",
  },
  {
    name: EventCardName.UnifiedRites,
    todoText: "Add 1 magic token to every magic troop in the Vanguard.",
  },
  {
    name: EventCardName.FriendsArrive,
    todoText: "Draw 2 champions and add them to your Fortress.",
  },
  {
    name: EventCardName.BackForMore,
    todoText:
      "Move 2 champions from the bottom of the discards to the top of the deck.",
  },
  {
    name: EventCardName.CampCrud,
    todoText: "Lower 3 of any dice by 1 each.",
  },
  {
    name: EventCardName.TrainedWarriors,
    todoText: "Add 1 strength token to every strength troop in the Vanguard.",
  },
  {
    name: EventCardName.BattleLust,
    todoText:
      "Add 2 strength tokens to the strongest strength troop in the Vanguard.",
  },
];
