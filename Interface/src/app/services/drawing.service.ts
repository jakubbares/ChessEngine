import {Injectable} from "@angular/core";
import {alphabet, Coors, numbers, FigurePosition, FigureImage} from "../classes";
import {FigurePositionService} from "./figure-position.service";

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


