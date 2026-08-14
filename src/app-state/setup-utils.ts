import { siegeEngineCards } from "./siege-engine-cards";
import { allTroopCards } from "./troop-cards";
import { SiegeEngineCard, SiegeEngineEffect, ITroopCard } from "./types";
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

  // Testing incendiaries: reserve it before truncation
  const wantedIndeex = siegeDeck.findIndex(
    (card) => card.effect === SiegeEngineEffect.Spinblade,
  );
  const [wanted] = siegeDeck.splice(wantedIndeex, 1);

  // setupBattlefield draws from the end with pop()
  siegeDeck.length = 12;
  siegeDeck.push(wanted);

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
