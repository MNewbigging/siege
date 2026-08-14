import { AttackType } from "./types";

/* Randomize array in-place using Durstenfeld shuffle algorithm */
export function shuffleArray(array: any[]) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

export function diceRoll() {
  return Math.floor(Math.random() * 6) + 1;
}

export function getCountOfAttackType(attackType: AttackType) {
  return attackType === AttackType.Strength ? 5 : 3;
}
