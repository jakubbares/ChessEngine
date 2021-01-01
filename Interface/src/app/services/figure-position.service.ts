import {Injectable} from "@angular/core";
import {alphabet, Color, Figure, initialFigureOrder, FigurePosition} from "../classes";
import {getAllIndexes} from "../functions/helper.functions";
import {createFiguresMap} from "../functions/board.functions";
import {toString} from 'lodash';
import {pawnReachedEndRow} from "../functions/moving.functions";

@Injectable()
export class FigurePositionService {
  figuresMap:  { [position: string]: FigurePosition; } = {};

  constructor() {
    this.figuresMap = createFiguresMap(this.getInitialPositions());
  }

  loadFigurePositionsFromDict(dict) {
    const fieldNumbers = Object.keys(dict);
    this.figuresMap = fieldNumbers.reduce((map, fieldNumber) => {
      const figurePosition = new FigurePosition();
      figurePosition.fromFigureLetter(dict[fieldNumber]);
      figurePosition.fromFieldNumber(parseInt(fieldNumber));
      map[figurePosition.str] = figurePosition;
      return map;
    }, {});
  }

  getInitialPositions(): FigurePosition[] {
    const blackInitial = [
      ...this.generatePawns("black"),
      ...this.generateFigure("bR"),
      ...this.generateFigure("bN"),
      ...this.generateFigure("bB"),
      ...this.generateFigure("bQ"),
      ...this.generateFigure("bK"),
    ];
    const whiteInitial = [
      ...this.generatePawns("white"),
      ...this.generateFigure("wR"),
      ...this.generateFigure("wN"),
      ...this.generateFigure("wB"),
      ...this.generateFigure("wQ"),
      ...this.generateFigure("wK"),
    ];
    return [...blackInitial, ...whiteInitial];
  }

  generatePawns(color: Color) {
    const row = color === "white" ? 2 : 7;
    const figure = color === "white" ? "wP" : "bP";
    return alphabet.map(letter => {
      return new FigurePosition( figure, letter + row);
    });
  }

  generateFigure(figure: Figure) {
    const color: Color = this.getColor(figure);
    const row = color === "white" ? 1 : 8;
    const piece = figure[1];
    const figureIndexes: number[] = getAllIndexes(initialFigureOrder, piece);
    const letters = figureIndexes.map(ix => alphabet[ix]);
    return letters.map(letter => {
      return new FigurePosition(figure, letter + row);
    });
  }

  getColor(figure: Figure): Color {
    return toString(figure).startsWith("w") ? "white" : "black";
  }
}


