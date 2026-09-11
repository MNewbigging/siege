import { eventUpdater } from "../events/event-updater";
import { EventCard, EventCardName } from "./event-cards";
import type { GameState } from "./game-state";
import { makeEventDeck } from "./setup-utils";
import { isSiegeCard, ITroopCard, RoundStage, SiegeEngineCard } from "./types";

export class EventResolver {
  constructor(private gameState: GameState) {}

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
        this.setupTroopCardBrowser(6); // todo test it works when troop cards can be drawn into battlefield
        break;
      case EventCardName.ShamansRitual:
        this.shamansRitual();
        break;
      case EventCardName.LuckyShot:
        break;
      case EventCardName.GargansBlessing:
        break;
      case EventCardName.Deserter:
        break;
      case EventCardName.Foresight:
        break;
      case EventCardName.ShoreWalls:
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
    const testCard = this.gameState.eventDeck.find(
      (card) => card.name === EventCardName.DangerousVisions,
    );

    return testCard ?? this.gameState.eventDeck.pop()!;
  }

  private finishResolveEventCard() {
    this.gameState.pendingEventSelection = undefined;
    eventUpdater.fire("event-update");
    this.gameState.toStage(RoundStage.D_Action);
  }

  private setupTroopCardBrowser(cardCount: number) {
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
      for (let i = col.length - 1; i > 0; i--) {
        const card = col[i];
        if (!isSiegeCard(card)) continue;

        // Found the first topmost siege card of the column now
        if (i === farthestIndex) {
          farthestSiegeCards.push(card);
        } else if (i > farthestIndex) {
          farthestSiegeCards.length = 0;
          farthestSiegeCards.push(card);
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
}
