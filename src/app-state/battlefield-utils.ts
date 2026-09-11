import { BattlefieldCard, isSiegeCard, SiegeEngineCard } from "./types";

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
