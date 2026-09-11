import { eventUpdater } from "../events/event-updater";
import { EventCard, EventCardName } from "./event-cards";
import type { GameState } from "./game-state";
import { RequestResolver } from "./request-resolver";
import { makeEventDeck } from "./setup-utils";
import { SiegeResolver } from "./siege-resolver";
import {
  AttackType,
  isSiegeCard,
  ITroopCard,
  RoundStage,
  SiegeEngineCard,
} from "./types";

export class EventResolver {
  constructor(
    private gameState: GameState,
    private siegeResolver: SiegeResolver,
    private requestResolver: RequestResolver,
  ) {}

  resolveEvent() {
    const eventCard = this.getNextEventCard();

    const onSelect = () => {
      // Acknowledge the event to start resolving it
      this.resolve(eventCard);
    };

    this.gameState.pendingEventSelection = { eventCard, onSelect };

    eventUpdater.fire("event-update");
  }

  private resolve(eventCard: EventCard) {
    switch (eventCard.name) {
      case EventCardName.DangerousVisions:
        this.dangerousVisions(); // todo test it works when troop cards can be drawn into battlefield
        break;
      case EventCardName.ShamansRitual:
        this.shamansRitual();
        break;
      case EventCardName.LuckyShot:
        this.luckyShot();
        break;
      case EventCardName.GargansBlessing:
        this.gargansBlessing();
        break;
      case EventCardName.Deserter:
        this.deserter();
        break;
      case EventCardName.Foresight:
        this.foresight();
        break;
      case EventCardName.ShoreWalls:
        this.shoreWalls();
        break;
      case EventCardName.AccidentsHappen:
        break;
      case EventCardName.FinalPush:
        break;
      case EventCardName.TurretShudders:
        break;
      case EventCardName.SpellSickness:
        break;
      case EventCardName.FoolsRush:
        break;
      case EventCardName.UnifiedRites:
        break;
      case EventCardName.FriendsArrive:
        break;
      case EventCardName.BackForMore:
        break;
      case EventCardName.CampCrud:
        break;
      case EventCardName.TrainedWarriors:
        break;
      case EventCardName.BattleLust:
        break;
    }
  }

  private getNextEventCard(): EventCard {
    if (!this.gameState.eventDeck.length)
      this.gameState.eventDeck = makeEventDeck();

    // Testing
    const testCardIndex = this.gameState.eventDeck.findIndex(
      (card) => card.name === EventCardName.Foresight,
    );

    if (testCardIndex >= 0)
      return this.gameState.eventDeck.splice(testCardIndex, 1)[0];

    return this.gameState.eventDeck.pop()!;
  }

  private finishResolveEventCard = () => {
    this.gameState.pendingEventSelection = undefined;
    eventUpdater.fire("event-update");
    this.gameState.toStage(RoundStage.D_Action);
  };

  private dangerousVisions() {
    const cardCount = 6;
    const cards = this.gameState.troopDeck.slice(-cardCount).reverse();

    if (!cards.length) {
      this.finishResolveEventCard();
      return;
    }

    const onAccept = (orderedCards: ITroopCard[]) => {
      const remainingDeck = this.gameState.troopDeck.slice(
        0,
        -orderedCards.length,
      );
      this.gameState.troopDeck = [
        ...remainingDeck,
        ...orderedCards.slice().reverse(),
      ];
      this.gameState.pendingTroopCardBrowser = undefined;
      eventUpdater.fire("troop-browser-update");

      this.finishResolveEventCard();
    };

    this.gameState.pendingTroopCardBrowser = { cards, onAccept };
    eventUpdater.fire("troop-browser-update");
  }

  private shamansRitual() {
    // Get the farthest siege engine(s)
    let farthestIndex = -1;
    let farthestSiegeCards: SiegeEngineCard[] = [];

    this.gameState.battlefield.forEach((col) => {
      // Start at the end
      for (let i = col.length - 1; i >= 0; i--) {
        const card = col[i];
        if (!isSiegeCard(card)) continue;

        // Found the first topmost siege card of the column now
        if (i === farthestIndex) {
          farthestSiegeCards.push(card);
        } else if (i > farthestIndex) {
          farthestSiegeCards = [card];
          farthestIndex = i;
        }

        break;
      }
    });

    // On select, add 2 magic tokens
    const onSelect = (siegeCard: SiegeEngineCard) => {
      // Token counts are undefined by default
      siegeCard.magicTokens ??= 0;
      siegeCard.magicTokens += 2;

      this.gameState.pendingSiegeSelection = undefined;
      eventUpdater.fire("siege-engine-update");

      this.finishResolveEventCard();
    };

    // Setup the pending siege selection
    this.gameState.pendingSiegeSelection = {
      validChoices: farthestSiegeCards,
      onSelect,
    };
    eventUpdater.fire("siege-engine-update");
  }

  private luckyShot() {
    // Get siege engines that are inactive right now
    const inactive: SiegeEngineCard[] = [];
    this.gameState.battlefield.forEach((col) => {
      col.forEach((rowCard, rowIndex) => {
        if (isSiegeCard(rowCard) && !rowCard.rowData[rowIndex].isActive)
          inactive.push(rowCard);
      });
    });

    if (!inactive.length) {
      this.finishResolveEventCard();
      return;
    }

    const onSelect = (siegeCard: SiegeEngineCard) => {
      this.gameState.pendingSiegeSelection = undefined;
      eventUpdater.fire("siege-engine-update");

      // Resolve this siege engine outside the normal siege-stage flow
      this.siegeResolver.resolve(siegeCard, () =>
        this.finishResolveEventCard(),
      );
    };

    this.gameState.pendingSiegeSelection = { validChoices: inactive, onSelect };
    eventUpdater.fire("siege-engine-update");
  }

  private gargansBlessing() {
    // Get the nearest siege engine
    let nearestIndex = 4;
    let nearestSiegeCards: SiegeEngineCard[] = [];

    this.gameState.battlefield.forEach((col) => {
      for (let i = 0; i < col.length; i++) {
        const card = col[i];
        if (!isSiegeCard(card)) continue;

        if (i === nearestIndex) nearestSiegeCards.push(card);
        else if (i < nearestIndex) {
          nearestSiegeCards = [card];
          nearestIndex = i;
        }

        break;
      }
    });

    // On select, add 2 magic tokens
    const onSelect = (siegeCard: SiegeEngineCard) => {
      siegeCard.magicTokens ??= 0;
      siegeCard.magicTokens += 2;

      this.gameState.pendingSiegeSelection = undefined;
      eventUpdater.fire("siege-engine-update");
      this.finishResolveEventCard();
    };

    this.gameState.pendingSiegeSelection = {
      validChoices: nearestSiegeCards,
      onSelect,
    };
    eventUpdater.fire("siege-engine-update");
  }

  private deserter() {
    this.requestResolver.setupDiceSpendRequest({
      type: AttackType.Strength,
      onComplete: this.finishResolveEventCard,
    });
  }

  private foresight() {
    const cardCount = 3;

    if (this.gameState.eventDeck.length < cardCount)
      this.gameState.eventDeck = makeEventDeck();

    const cards = this.gameState.eventDeck.slice(-cardCount).reverse();

    const onAccept = (orderedCards: EventCard[]) => {
      const remainingDeck = this.gameState.eventDeck.slice(
        0,
        -orderedCards.length,
      );
      this.gameState.eventDeck = [
        ...remainingDeck,
        ...orderedCards.slice().reverse(),
      ];
      this.gameState.pendingEventCardBrowser = undefined;
      eventUpdater.fire("event-browser-update");

      this.finishResolveEventCard();
    };

    this.gameState.pendingEventCardBrowser = { cards, onAccept };
    eventUpdater.fire("event-browser-update");
  }

  private shoreWalls() {}
}
