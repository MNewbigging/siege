import { eventUpdater } from "../events/event-updater";
import {
  getFarthestSiegeEngines,
  getNearestSiegeEngines,
  getTroopsByType,
  getWeakestFrontTroops,
} from "./battlefield-utils";
import { EventCard, EventCardName } from "./event-cards";
import type { GameState } from "./game-state";
import { RequestResolver } from "./request-resolver";
import { makeEventDeck } from "./setup-utils";
import { SiegeResolver } from "./siege-resolver";
import {
  AttackType,
  isSiegeCard,
  TroopCard,
  RoundStage,
  SiegeEngineCard,
  Turret,
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
        this.shoreWalls(); // todo test when I have flames on turrets
        break;
      case EventCardName.AccidentsHappen:
        this.accidentsHappen(); // todo test when I have champions
        break;
      case EventCardName.FinalPush:
        this.finalPush();
        break;
      case EventCardName.TurretShudders:
        this.turretShudders();
        break;
      case EventCardName.SpellSickness:
        this.spellSickness();
        break;
      case EventCardName.FoolsRush:
        this.foolsRush();
        break;
      case EventCardName.UnifiedRites:
        this.unifiedRites();
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
      (card) => card.name === EventCardName.UnifiedRites,
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

    const onAccept = (orderedCards: TroopCard[]) => {
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
    const farthestSiegeCards = getFarthestSiegeEngines(
      this.gameState.battlefield,
    );

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

      this.siegeResolver.resolve(siegeCard, () =>
        this.finishResolveEventCard(),
      );
    };

    this.gameState.pendingSiegeSelection = { validChoices: inactive, onSelect };
    eventUpdater.fire("siege-engine-update");
  }

  private gargansBlessing() {
    // Get the nearest siege engine
    let nearestSiegeCards = getNearestSiegeEngines(this.gameState.battlefield);

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

  private shoreWalls() {
    // Get all turrets which have at least 1 flame
    const enflamedTurrets = this.gameState.turrets.filter(
      (turret) => turret.flames > 0,
    );

    if (!enflamedTurrets.length) {
      this.finishResolveEventCard();
      return;
    }

    const onSelect = (turret: Turret) => {
      turret.flames = 0;
      this.gameState.pendingTurretSelection = undefined;
      eventUpdater.fire("turret-update");
      this.finishResolveEventCard();
    };

    this.gameState.pendingTurretSelection = {
      validChoices: enflamedTurrets,
      onSelect,
    };
    eventUpdater.fire("turret-update");
  }

  private accidentsHappen() {
    this.requestResolver.setupChampionFlipRequest(() =>
      this.requestResolver.setupChampionFlipRequest(
        this.finishResolveEventCard,
      ),
    );
  }

  private finalPush() {
    const nearestSiegeEngines = getNearestSiegeEngines(
      this.gameState.battlefield,
    );

    const onSelect = (siegeCard: SiegeEngineCard) => {
      siegeCard.strengthTokens ??= 0;
      siegeCard.strengthTokens += 2;

      this.gameState.pendingSiegeSelection = undefined;
      eventUpdater.fire("siege-engine-update");
      this.finishResolveEventCard();
    };

    this.gameState.pendingSiegeSelection = {
      validChoices: nearestSiegeEngines,
      onSelect,
    };
    eventUpdater.fire("siege-engine-update");
  }

  private turretShudders() {
    const validChoices = this.gameState.turrets.filter(
      (turret) => turret.flames < 3,
    );

    if (!validChoices.length) {
      this.finishResolveEventCard();
      return;
    }

    const onSelect = (turret: Turret) => {
      turret.flames++;
      this.gameState.pendingTurretSelection = undefined;
      eventUpdater.fire("turret-update");
      this.finishResolveEventCard();
    };

    this.gameState.pendingTurretSelection = { validChoices, onSelect };
    eventUpdater.fire("turret-update");
  }

  private spellSickness() {
    this.requestResolver.setupDiceSpendRequest({
      type: AttackType.Holy,
      onComplete: this.finishResolveEventCard,
    });
  }

  private foolsRush() {
    const weakestTroops = getWeakestFrontTroops(this.gameState.battlefield);

    if (!weakestTroops.length) {
      this.finishResolveEventCard();
      return;
    }

    const onSelect = (troop: TroopCard) => {
      troop.strengthTokens ??= 0;
      troop.strengthTokens += 2;
      this.gameState.pendingTroopSelection = undefined;
      eventUpdater.fire("troop-update");
      this.finishResolveEventCard();
    };

    this.gameState.pendingTroopSelection = {
      validChoices: weakestTroops,
      onSelect,
    };
    eventUpdater.fire("troop-update");
  }

  private unifiedRites() {
    const magicTroops = getTroopsByType(
      this.gameState.battlefield,
      AttackType.Holy,
    );

    magicTroops.forEach((troop) => {
      troop.magicTokens ??= 0;
      troop.magicTokens++;
    });

    eventUpdater.fire("troop-update");
    this.finishResolveEventCard();
  }
}
