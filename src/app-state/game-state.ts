import { siegeEngineCards } from "./siege-engine-cards";
import { allTroopCards } from "./troop-cards";
import {
  AttackType,
  BattlefieldCard,
  SiegeEngineCard,
  TroopCard,
} from "./types";
("./siege-engine-cards");

export class GameState {
  siegeDeck: SiegeEngineCard[];
  troopDeck: TroopCard[];
  playerHand: TroopCard[];
  battlefield: BattlefieldCard[][] = []; // by column, index 0 is front/vanguard

  constructor() {
    this.siegeDeck = this.makeSiegeDeck();
    const troopDeck = this.makeTroopDeck();
    this.playerHand = troopDeck.splice(-2);
    this.troopDeck = troopDeck;

    // There are 5 columns
    for (let col = 0; col < 5; col++) {
      const column: BattlefieldCard[] = [];

      // Put 4 troops in first 4 spots
      for (let i = 0; i < 4; i++) {
        column.push(this.troopDeck.pop());
      }

      // Seige engine at the top in last spot
      column.push(this.siegeDeck.pop());

      this.battlefield.push(column);
    }

    console.log("battlefield", this.battlefield);
  }

  private makeSiegeDeck() {
    // Each card is doubled
    const siegeDeck: SiegeEngineCard[] = [];

    siegeEngineCards.forEach((card) => {
      siegeDeck.push(card, card);
    });

    // Shuffled
    shuffleArray(siegeDeck);

    // Then remove 5
    siegeDeck.length = 13;

    return siegeDeck;
  }

  private makeTroopDeck() {
    const troopDeck: TroopCard[] = [];

    allTroopCards.forEach((card) => {
      const count = card.type === AttackType.Strength ? 5 : 3;

      for (let i = 0; i < count; i++) {
        troopDeck.push(card);
      }
    });

    // Shuffle
    shuffleArray(troopDeck);

    // Remove 2
    troopDeck.length = 46;

    return troopDeck;
  }
}

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}
