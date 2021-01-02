export function getAllIndexes(arr, val): number[] {
  const indexes: number[] = [];
  let i = -1;
  while ((i = arr.indexOf(val, i + 1)) !== -1) {
    indexes.push(i);
  }
  return indexes;
}


export function zip(arr1, arr2): any[] {
  return arr1.map((e, i) => {
    return [e, arr2[i]];
  });
}

export function fillShorterWithZeroes(arr1, arr2): any[] {
  if (arr1.length === arr2.length) return [arr1, arr2];
  const longer = arr1.length < arr2.length ? arr2 : arr1;
  const repeated = repeatString([0], longer.length);
  return [longer === arr1 ? arr1 : repeated, longer === arr2 ? arr2 : repeated];
}


export const repeatString = (item, numRepeats) => numRepeats ? item.concat(repeatString(item, --numRepeats)) : [];

export const repeatItemInArray = (item, numRepeats) => {
  return [...Array(numRepeats).keys()].map(x => item);
}

export function isUpperCase(character: string): boolean {
  return character === character.toUpperCase();
}
