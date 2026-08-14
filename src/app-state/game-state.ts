import { eventUpdater } from "../events/event-updater";
import { siegeEngineCards } from "./siege-engine-cards";
import { allTroopCards } from "./troop-cards";
import {
  AttackType,
  BattlefieldCard,
  DiceValue,
  RoundStage,
  ISiegeEngineCard,
  ITroopCard,
} from "./types";
import { diceRoll, getCountOfAttackType, shuffleArray } from "./utils";
("./siege-engine-cards");

export class GameState {
  currentRound = 1;
  maxRounds = 7;
  roundStage: RoundStage = RoundStage.A_RollDice;

  siegeDeck: ISiegeEngineCard[];
  troopDeck: ITroopCard[];
  playerHand: ITroopCard[];
  battlefield: BattlefieldCard[][] = []; // by column, index 0 is front/vanguard
  activeDice: DiceValue[] = [];
  spentDice: DiceValue[] = [];

  private strengthDice: number;
  private magicDice: number;

  constructor() {
    // Setup
    this.siegeDeck = this.makeSiegeDeck();
    const troopDeck = this.makeTroopDeck();
    this.playerHand = troopDeck.splice(-2);
    this.troopDeck = troopDeck;

    this.battlefield = this.setupBattlefield();

    this.strengthDice = 3;
    this.magicDice = 2;
  }

  rollPlayerDice() {
    for (let i = 0; i < this.strengthDice; i++) {
      this.activeDice.push({ type: AttackType.Strength, value: diceRoll() });
    }

    for (let i = 0; i < this.magicDice; i++) {
      this.activeDice.push({ type: AttackType.Magic, value: diceRoll() });
    }

    this.roundStage = RoundStage.B_ResolveSiege;

    eventUpdater.fire("rolled-dice");
  }

  private makeSiegeDeck() {
    const siegeDeck: ISiegeEngineCard[] = [];

    siegeEngineCards.forEach((card) => {
      // Each card is doubled
      siegeDeck.push(card, card);
    });

    // Shuffled
    shuffleArray(siegeDeck);

    // Then remove 5
    siegeDeck.length = 13;

    return siegeDeck;
  }

  private makeTroopDeck() {
    const troopDeck: ITroopCard[] = [];

    allTroopCards.forEach((card) => {
      const count = getCountOfAttackType(card.type);

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

  private setupBattlefield() {
    const battlefield: BattlefieldCard[][] = [];

    // There are 5 columns on the battlefield
    for (let col = 0; col < 5; col++) {
      const column: BattlefieldCard[] = [];

      // Put 4 troops in first 4 spots
      for (let i = 0; i < 4; i++) {
        column.push(this.troopDeck.pop());
      }

      // Seige engine at the top in last spot
      column.push(this.siegeDeck.pop());

      battlefield.push(column);
    }

    return battlefield;
  }
}
