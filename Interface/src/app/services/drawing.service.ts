import {Injectable} from "@angular/core";
import {alphabet, Coors, numbers, FigurePosition, FigureImage} from "../classes";
import {FigurePositionService} from "./figure-position.service";
import {piecesCountMap} from "../functions/board.functions";

@Injectable()
export class DrawingService {
  length = 600;
  board = {length: this.length, squareLength: this.length / 8};

  constructor(private position: FigurePositionService) {
  }

  drawPieces(): FigureImage[] {
    const fields = Object.keys(this.position.figuresMap);
    return fields.map(field => {
      const figure = this.position.figuresMap[field];
      const coors = this.getCoors(figure);
      return new FigureImage(figure, coors);
    });
  }

  capturedPiecesMap(): {} {
    const beginningFigures = this.position.getInitialPositions().map(position => position.figure);
    const currentFigures = Object.keys(this.position.figuresMap).map(field => {
      const figure = this.position.figuresMap[field]
      return figure.figure;
    });
    const beginningFiguresCountMap = piecesCountMap(beginningFigures);
    const currentFiguresCountMap = piecesCountMap(currentFigures);
    return Object.keys(beginningFiguresCountMap).reduce((map, figure) => {
      const beginningCount = beginningFiguresCountMap[figure];
      const currentCount = currentFiguresCountMap.hasOwnProperty(figure) ?
        currentFiguresCountMap[figure] : 0;
      map[figure] = beginningCount - currentCount;
      return map;
    }, {});
  }

  getCoors(position: FigurePosition): Coors {
    const halfSquare = this.board.squareLength / 2;
    const alphaIndex = alphabet.indexOf(position.letter);
    const numberIndex = numbers.indexOf(position.number.toString());
    return {
      x: alphaIndex * this.board.squareLength,
      y: numberIndex * this.board.squareLength
    };

  }
}


