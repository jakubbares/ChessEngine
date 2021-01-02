import {alphabet, Figure, FigurePosition} from "../classes";

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


export function piecesCountMap(figures: Figure[]) {
  return figures.reduce((map, figure) => {
    if (!map.hasOwnProperty(figure)) {
      map[figure] = 0;
    }
    map[figure] += 1;
    return map;
  }, {});
}

