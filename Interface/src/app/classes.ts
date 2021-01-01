import {isUpperCase} from "./functions/helper.functions";

export const alphabet = 'abcdefgh'.split('');
export const numbers = '12345678'.split('');

export const initialFigureOrder = ["R", "N", "B", "Q", "K",  "B", "N", "R"];

export type Piece = "R" | "N" | "B" | "Q" | "K" | "P";
export type Figure = BlackFigure | WhiteFigure;
export type BlackFigure = "bP" | "bN"  | "bB" | "bR" | "bQ" | "bK";
export type WhiteFigure = "wP" | "wN"  | "wB" | "wR" | "wQ" | "wK";
const figures: Figure[] = ["bP", "bN", "bB", "bR", "bQ", "bK", "wP", "wN", "wB", "wR", "wQ", "wK"];

export type Color = "white" | "black";

export class Coors {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class FigurePosition {
  letterIndex: number;
  letter: string;
  number: number;
  str: string;
  fieldNumber: number;
  figure: Figure;
  color: Color;

  constructor(figure: Figure = "wP", position: string = "a1") {
    this.letter = position[0];
    this.letterIndex = alphabet.indexOf(position[0]) + 1;
    this.number = parseInt(position[1]);
    this.str = this.letter + this.number;
    this.fieldNumber = (this.number - 1) * 8 + this.letterIndex - 1;
    this.figure = figure;
    this.color = figure[0] === "w" ? "white" : "black";
  }

  fromFigureLetter(figureLetter: string) {
    const figure = isUpperCase(figureLetter) ? "w" + figureLetter : "b" + figureLetter.toUpperCase();
    this.figure = figures.find(fig => fig === figure);
    this.color = this.figure[0] === "w" ? "white" : "black";
  }

  fromCoor(letterCoor, numberCoor) {
    if (!letterCoor || !numberCoor) return null;
    this.letter = alphabet[parseInt(letterCoor) - 1];
    this.letterIndex = parseInt(letterCoor);
    this.number = parseInt(numberCoor);
    this.str = this.letter + this.number;
    this.fieldNumber = (this.number - 1) * 8 + this.letterIndex - 1;
    return this;
  }

  fromStr(str: string) {
    if (!str) return null;
    this.letter = str[0];
    this.letterIndex = alphabet.indexOf(this.letter) + 1;
    this.number = parseInt(str[1]);
    this.str = str;
    this.fieldNumber = (this.number - 1) * 8 + this.letterIndex - 1;
    return this;
  }

  fromFieldNumber(num: number) {
    if (!num) return null;
    this.number = Math.ceil((num + 1) / 8);
    const index = (num + 1) % 8;
    this.letterIndex = index === 0 ? 8 : index;
    this.letter = alphabet[this.letterIndex - 1];
    this.str = this.letter + this.number;
    this.fieldNumber = (this.number - 1) * 8 + this.letterIndex - 1;
    return this;
  }
}


export class FigureImage {
  figure: Figure;
  piece: string;
  position: FigurePosition;
  coors: Coors;
  imageSrc: string;

  constructor(position: FigurePosition, coors: Coors) {
    this.figure = position.figure;
    this.piece = position.figure[1];
    this.position = position;
    this.coors = coors;
    this.imageSrc = `/assets/images/pieces/${position.figure}.png`;
  }
}
