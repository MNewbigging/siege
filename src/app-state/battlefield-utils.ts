import {
  BattlefieldCard,
  isSiegeCard,
  isTroopCard,
  TroopCard,
  SiegeEngineCard,
  AttackType,
} from "./types";

// Removes a card in place, leaving an empty (undefined) slot rather than shifting the column
export function removeCard(column: BattlefieldCard[], rowIndex: number) {
  column[rowIndex] = undefined;
}

// Slides cards down toward the front (index 0), collapsing gaps to the top of the column
export function slideColumnDown(column: BattlefieldCard[]) {
  const remaining = column.filter((card) => card !== undefined);
  const emptySlots = column.length - remaining.length;
  return [...remaining, ...new Array<undefined>(emptySlots).fill(undefined)];
}

export function slideBattlefieldDown(
  battlefield: BattlefieldCard[][],
): BattlefieldCard[][] {
  return battlefield.map(slideColumnDown);
}

export function getNearestSiegeEngines(
  battlefield: BattlefieldCard[][],
): SiegeEngineCard[] {
  return getSiegeEnginesAtRowExtreme(
    battlefield,
    (row, current) => row < current,
  );
}

export function getFarthestSiegeEngines(
  battlefield: BattlefieldCard[][],
): SiegeEngineCard[] {
  return getSiegeEnginesAtRowExtreme(
    battlefield,
    (row, current) => row > current,
  );
}

function getTroopDefeatValue(troop: TroopCard): number {
  return troop.toDefeatA.value + (troop.toDefeatB?.value ?? 0);
}

export function getWeakestFrontTroops(
  battlefield: BattlefieldCard[][],
): TroopCard[] {
  return getFrontTroopsAtValueExtreme(
    battlefield,
    (value, current) => value < current,
  );
}

export function getStrongestFrontTroops(
  battlefield: BattlefieldCard[][],
): TroopCard[] {
  return getFrontTroopsAtValueExtreme(
    battlefield,
    (value, current) => value > current,
  );
}

function getFrontTroopsAtValueExtreme(
  battlefield: BattlefieldCard[][],
  isBetterValue: (value: number, currentValue: number) => boolean,
): TroopCard[] {
  let selectedValue: number | undefined;
  let selectedTroops: TroopCard[] = [];

  battlefield.forEach((column) => {
    const card = column[0];
    if (!isTroopCard(card)) return;

    const value = getTroopDefeatValue(card);
    if (selectedValue === undefined || isBetterValue(value, selectedValue)) {
      selectedValue = value;
      selectedTroops = [card];
    } else if (value === selectedValue) {
      selectedTroops.push(card);
    }
  });

  return selectedTroops;
}

function getSiegeEnginesAtRowExtreme(
  battlefield: BattlefieldCard[][],
  isBetterRow: (rowIndex: number, currentRowIndex: number) => boolean,
) {
  let selectedRowIndex: number | undefined;
  let selectedCards: SiegeEngineCard[] = [];

  battlefield.forEach((column) => {
    for (let rowIndex = 0; rowIndex < column.length; rowIndex++) {
      const card = column[rowIndex];
      if (!isSiegeCard(card)) continue;

      if (
        selectedRowIndex === undefined ||
        isBetterRow(rowIndex, selectedRowIndex)
      ) {
        selectedRowIndex = rowIndex;
        selectedCards = [card];
      } else if (rowIndex === selectedRowIndex) {
        selectedCards.push(card);
      }

      break;
    }
  });

  return selectedCards;
}

export function getTroopsByType(
  battlefield: BattlefieldCard[][],
  type: AttackType,
) {
  const troops: TroopCard[] = [];

  battlefield.forEach((col) => {
    col.forEach((rowCard) => {
      if (isTroopCard(rowCard) && rowCard.type === type) {
        troops.push(rowCard);
      }
    });
  });

  return troops;
}
