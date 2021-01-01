import {alphabet, FigurePosition} from "../classes";

export function cartesian(...sets) {
  return sets.reduce((acc, set) => acc.flatMap(x => set.map(y => [ ...x, y ])), [[]]);
}


export function NNeg(num: number) {
  return num >= 1 ? num.toString() : null;
}

export function createFiguresMap(figures: FigurePosition[]): { [position: string]: FigurePosition; } {
  return figures.reduce((map, figure) => {
    map[figure.str] = figure;
    return map;
  }, {});
}
