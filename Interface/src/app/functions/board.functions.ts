import {alphabet, Color, Figure, FigurePosition} from "../classes";
import {repeatItemInArray, repeatString} from "./helper.functions";

export function cartesian(...sets): any[] {
  return sets.reduce((acc, set) => acc.flatMap(x => set.map(y => [ ...x, y ])), [[]]);
}

export function NNeg(num: number): string {
  return num >= 1 ? num.toString() : null;
}

export function createFiguresMap(figures: FigurePosition[]): { [position: string]: FigurePosition; } {
  return figures.reduce((map, figure) => {
    map[figure.str] = figure;
    return map;
  }, {});
}


export function piecesCountMap(figures: Figure[]): {} {
  return figures.reduce((map, figure) => {
    if (!map.hasOwnProperty(figure)) {
      map[figure] = 0;
    }
    map[figure] += 1;
    return map;
  }, {});
}

export function getCapturedPiecesFromCountMap(capturedPiecesMap: {}, color: Color): any[] {
  return Object.keys(capturedPiecesMap)
    .filter(figure => figure.startsWith(color === "white" ? "w" : "b"))
    .flatMap(figure => {
      const count = capturedPiecesMap[figure];
      return repeatItemInArray(figure, count);
    });
}
