import {NNeg} from "./board.functions";
import {alphabet, Figure, FigurePosition, numbers} from '../classes';
const numbersArray = numbers.map(number => parseInt(number));

function ifNotNull(source: FigurePosition, moveFn, length: number = 1) {
  return source ? moveFn(source, length) : null;
}

export const up = (source: FigurePosition, length: number = 1) =>  new FigurePosition(source.figure).fromCoor(NNeg(source.letterIndex) , NNeg(source.number + length));
export const down = (source: FigurePosition, length: number = 1) =>  new FigurePosition(source.figure).fromCoor(NNeg(source.letterIndex) , NNeg(source.number - length));
export const left = (source: FigurePosition, length: number = 1) => new FigurePosition(source.figure).fromCoor(NNeg(source.letterIndex - length) , NNeg(source.number));
export const right = (source: FigurePosition, length: number = 1) => new FigurePosition(source.figure).fromCoor( NNeg(source.letterIndex + length) , NNeg(source.number));
export const upLeft = (source: FigurePosition, length: number = 1) => new FigurePosition(source.figure).fromCoor( NNeg(source.letterIndex - length) , NNeg(source.number + length));
export const upRight = (source: FigurePosition, length: number = 1) => new FigurePosition(source.figure).fromCoor( NNeg(source.letterIndex + length) , NNeg(source.number + length));
export const downLeft = (source: FigurePosition, length: number = 1) =>  new FigurePosition(source.figure).fromCoor(NNeg(source.letterIndex - length), NNeg(source.number - length));
export const downRight = (source: FigurePosition, length: number = 1) => new FigurePosition(source.figure).fromCoor( NNeg(source.letterIndex + length), NNeg(source.number - length));

export const moreUp = (source: FigurePosition) => numbersArray.map(length => up(source, length));
export const moreDown = (source: FigurePosition) => numbersArray.map(length => down(source, length));
export const moreLeft = (source: FigurePosition) => numbersArray.map(length => left(source, length));
export const moreRight = (source: FigurePosition) => numbersArray.map(length => right(source, length));
export const moreUpLeft = (source: FigurePosition) => numbersArray.map(length => upLeft(source, length));
export const moreUpRight = (source: FigurePosition) => numbersArray.map(length => upRight(source, length));
export const moreDownLeft = (source: FigurePosition) => numbersArray.map(length => downLeft(source, length));
export const moreDownRight = (source: FigurePosition) => numbersArray.map(length => downRight(source, length));


export const jumps = (source: FigurePosition) => {
  return [
    ifNotNull(up(source, 2), left),
    ifNotNull(down(source, 2), left),
    ifNotNull(up(source, 2), right),
    ifNotNull(down(source, 2), right),
    ifNotNull(up(source), left, 2),
    ifNotNull(down(source), left, 2),
    ifNotNull(up(source), right, 2),
    ifNotNull(down(source), right, 2),
  ];
};

export function pawnReachedEndRow(figurePosition: FigurePosition, number: number) {
  const piece = figurePosition.figure[1];
  const endRow = figurePosition.color === "black" ? number == 1 : number == 8;
  const vole = 8
  return piece === "P" && endRow;
}
