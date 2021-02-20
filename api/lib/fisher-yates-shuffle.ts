'use strict';

const defaultChoices = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
  'w', 'x', 'y', 'z', '1', '2', '4', '5', '6', '7', '8', '9', '0',
];

export const defaultExtChoices = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
  'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
  'w', 'x', 'y', 'z', '1', '2', '4', '5', '6', '7', '8', '9', '0', '-', '.', '_',
  '~',
];

export const defaultLowerAlphaNumeric = [
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
  'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '1', '2', '4', '5', '6', '7',
  '8', '9', '0',
];

export const defaultUpperAlphaNumeric = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '1', '2', '4', '5', '6', '7',
  '8', '9', '0',
];

export const defaultNumeric = [
  '1', '2', '4', '5', '6', '7', '8', '9', '0',
];

export const defaultNumericExt = [
  '1', '2', '4', '5', '6', '7', '8', '9', '0', '-', '.', '_', '~',
];


export const fisherYatesShuffle = (a: string[]) => {
  let j, x, i;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
};

export const generateRandomString = (len: number, choices: string[] = defaultChoices) => {
  let ret = '';
  for (let i = 0; i < len; i++) {
    const fullSet = [...choices];
    fisherYatesShuffle(fullSet);
    ret = ret + fullSet.pop();
  }
  return ret;
};
