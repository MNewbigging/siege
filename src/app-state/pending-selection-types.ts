import { Champion } from "./champion-cards";
import { EventCard } from "./event-cards";
import { Dice, SiegeEngineCard, TroopCard, Turret } from "./types";

export interface PendingDiceSelection {
  validChoices: Dice[];
  onSelect: (dice: Dice) => void;
}

export interface PendingChampionSelection {
  validChoices: Champion[];
  onSelect: (champion: Champion) => void;
}

export interface PendingSiegeSelection {
  validChoices: SiegeEngineCard[];
  onSelect: (siege: SiegeEngineCard) => void;
}
export interface PendingTroopCardBrowser {
  cards: TroopCard[];
  onAccept: (cards: TroopCard[]) => void;
}

export interface PendingEventCardBrowser {
  cards: EventCard[];
  onAccept: (cards: EventCard[]) => void;
}

export interface PendingEventSelection {
  eventCard: EventCard;
  onSelect: () => void;
}

export interface PendingTurretSelection {
  validChoices: Turret[];
  onSelect: (turret: Turret) => void;
}

export interface PendingTroopSelection {
  validChoices: TroopCard[];
  onSelect: (troop: TroopCard) => void;
}
