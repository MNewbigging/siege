import { BattlefieldCard, isSiegeCard, SiegeEngineCard } from "./types";

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
