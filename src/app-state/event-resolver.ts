import { eventUpdater } from "../events/event-updater";
import { EventCard, EventCardName } from "./event-cards";
import type { GameState } from "./game-state";
import { ITroopCard, RoundStage } from "./types";

export class EventResolver {
  constructor(private gameState: GameState) {}

  resolve(eventCard: EventCard) {
    switch (eventCard.name) {
      case EventCardName.DangerousVisions:
        this.setupTroopCardBrowser(6);
        break;
      case EventCardName.ShamansRitual:
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

  completeTroopCardBrowser(orderedCards: ITroopCard[]) {
    if (!this.gameState.pendingTroopCardBrowser) return;

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
  }

  private finishResolveEventCard() {
    this.gameState.currentlyResolvingEventCard = undefined;
    eventUpdater.fire("event-update");
    this.gameState.toStage(RoundStage.D_Action);
  }

  private setupTroopCardBrowser(cardCount: number) {
    const cards = this.gameState.troopDeck.slice(-cardCount).reverse();

    if (!cards.length) {
      this.finishResolveEventCard();
      return;
    }

    this.gameState.pendingTroopCardBrowser = { cards };
    eventUpdater.fire("troop-browser-update");
  }
}
