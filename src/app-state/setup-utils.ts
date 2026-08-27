import { eventCards } from "./event-cards";
import { siegeEngineCards } from "./siege-engine-cards";
import { allTroopCards } from "./troop-cards";
import { SiegeEngineCard, ITroopCard, Turret } from "./types";
import { shuffleArray, getCountOfAttackType } from "./utils";

export function makeSiegeDeck() {
  const siegeDeck: SiegeEngineCard[] = [];

  siegeEngineCards.forEach((card) => {
    // Each card is doubled
    for (let copy = 0; copy < 2; copy++) {
      siegeDeck.push({
        ...card,
        rowData: card.rowData.map((row) => ({ ...row })),
      });
    }
  });

  // Shuffled
  shuffleArray(siegeDeck);

  // Remove 5 cards
  siegeDeck.length = 13;

  return siegeDeck;
}

export function makeTroopDeck() {
  const troopDeck: ITroopCard[] = [];

  allTroopCards.forEach((card) => {
    const count = getCountOfAttackType(card.type);

    for (let i = 0; i < count; i++) {
      troopDeck.push({
        ...card,
        toDefeatA: { ...card.toDefeatA },
        toDefeatB: card.toDefeatB ? { ...card.toDefeatB } : undefined,
      });
    }
  });

  // Shuffle
  shuffleArray(troopDeck);

  // Remove 2
  troopDeck.length = 46;

  return troopDeck;
}

export function makeTurrets(): Turret[] {
  return Array.from({ length: 5 }, () => ({ flames: 0 }) as Turret);
}

export function makeEventDeck() {
  // Make a copy of the event cards
  const events = [...eventCards];

  // Shuffle
  shuffleArray(events);

  return events;
}
