import {Injectable} from "@angular/core";
import {
  down, downLeft, downRight, jumps, left, right, up, upLeft, upRight,
  moreDown, moreDownLeft, moreDownRight, moreLeft, moreRight, moreUp, moreUpLeft, moreUpRight,
} from "../functions/moving.functions";
import {alphabet, Color, numbers, FigurePosition, Piece, Figure} from '../classes';
import {cartesian} from "../functions/board.functions";
import {FigurePositionService} from "./figure-position.service";
import {fillShorterWithZeroes, zip} from "../functions/helper.functions";
import { range } from 'lodash';

@Injectable()
export class PotentialMovesService {
  fields = cartesian(alphabet, numbers).map(([letter, number]) => letter + number);

  constructor(public position: FigurePositionService) {
  }

  isMoveLegal(figurePosition, move) {
    const positionMap = this.position.figuresMap;
    let diffLetter = Math.abs(move.letterIndex - figurePosition.letterIndex);
    let diffNumber = move.number - figurePosition.number;
    const letterSign = Math.sign(diffLetter);
    const numberSign = Math.sign(diffNumber);
    diffLetter = Math.abs(diffLetter);
    diffNumber = Math.abs(diffNumber);
    const [rangeLetter, rangeNumber] = fillShorterWithZeroes(range(0, diffLetter), range(0, diffNumber));
    const zippedIndexes = zip(rangeLetter, rangeNumber);
    const maxDistance = zippedIndexes.reduce((distance, [letterDiff, numberDiff], index) => {
      if (index === 0) {
        return 8;
      }
      const passedField = alphabet[figurePosition.letterIndex + (letterSign * letterDiff) - 1]
        + (figurePosition.number + (numberSign * numberDiff));
      if (positionMap[passedField]) {
        if (positionMap[passedField].color === figurePosition.color) {
          distance = Math.max(letterDiff, numberDiff);
        } else if (positionMap[passedField].color !== figurePosition.color) {
          distance = Math.max(letterDiff, numberDiff) - 1;
        }
      }
      return distance;
    }, 8);
    console.log({move: move.str, diffNumber, diffLetter, numberSign, maxDistance})
    return maxDistance >= diffLetter && maxDistance >= diffNumber;
  }

  figureMoves(figurePosition: FigurePosition): FigurePosition[] {
    const piece = figurePosition.figure[1];
    switch (piece) {
      case "N": return this.knight(figurePosition);
      case "R": return this.rook(figurePosition);
      case "B": return this.bishop(figurePosition);
      case "Q": return this.queen(figurePosition);
      case "K": return this.king(figurePosition);
    }
  }

  fieldsToMove(figurePosition: FigurePosition) {
    const piece = figurePosition.figure[1];
    const color: Color = figurePosition.figure[0] === "w" ? "white" : "black";
    if (piece === "P") {
      const {free, take} = this.pawn(figurePosition, color);
      const freeMoves = free.filter(move => {
        return this.freeFieldsMap(color)[move.str] === "free";
      });
      const takeMoves = take.filter(move => {
        return this.freeFieldsMap(color)[move.str] === "opposite";
      });
      return [...freeMoves, ...takeMoves];
    } else {
      return this.figureMoves(figurePosition).filter((move: FigurePosition) => {
        return ["free", "opposite"].includes(this.freeFieldsMap(color)[move.str]);
      });
    }
  }

  freeFieldsMap(color: Color) {
    return this.fields.reduce((map, field) => {
      const opposite = color === "white" ? "b" : "w";
      const positionMap = this.position.figuresMap;
      const isFree = !positionMap.hasOwnProperty(field);
      const isOpposite = positionMap.hasOwnProperty(field) && positionMap[field].figure.startsWith(opposite);
      map[field] = isFree ? "free" : isOpposite ? "opposite" : null;
      return map;
    }, {});
  }

  knight(s: FigurePosition) {
    return jumps(s).filter(move => move);
  }

  rook(s: FigurePosition) {
    return [...moreUp(s), ...moreDown(s), ...moreLeft(s), ...moreRight(s)].filter(move => move);
  }

  bishop(s: FigurePosition) {
    return [...moreUpLeft(s), ...moreUpRight(s), ...moreDownLeft(s), ...moreDownRight(s)].filter(move => move);
  }

  queen(s: FigurePosition) {
    return [...moreUp(s), ...moreDown(s), ...moreLeft(s), ...moreRight(s), ...moreUpLeft(s),
      ...moreUpRight(s), ...moreDownLeft(s), ...moreDownRight(s)].filter(move => move);
  }

  king(s: FigurePosition) {
    return [up(s), down(s), left(s), right(s), upLeft(s), upRight(s), downLeft(s), downRight(s)].filter(move => {
      return move;
    });
  }

  pawn(s: FigurePosition, color: Color) {
    const freeMoves = [];
    const takeMoves = [];
    const secondRow = color === "white" ? 2 : 7;
    if (s.number === secondRow) {
      freeMoves.push(color === "white" ? up(s, 2) : down(s, 2));
    }
    freeMoves.push(color === "white" ? up(s) : down(s));
    takeMoves.push(
      color === "white" ? upLeft(s) : downLeft(s),
      color === "white" ? upRight(s) : downRight(s),
    );
    return {free: freeMoves.filter(move => move), take: takeMoves.filter(move => move)};
  }

  kingIsInCheck(heroColor: Color) {
    const figures = Object.values(this.position.figuresMap);
    const king = figures.find((figure: FigurePosition) => {
      return figure.color === heroColor && figure.figure[1] === "K";
    });
    return figures.some((figure: FigurePosition) =>  {
      const checks = this.fieldsToMove(figure).filter((move: FigurePosition) => {
        return move.str === king.str;
      });
      return checks.length > 0;
    });
  }
}

