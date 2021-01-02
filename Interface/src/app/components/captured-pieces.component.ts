import { Component } from '@angular/core';
import {alphabet, Color, Figure, FigureImage, FigurePosition, numbers} from "../classes";
import {FigurePositionService} from "../services/figure-position.service";
import {DrawingService} from "../services/drawing.service";
import {PotentialMovesService} from "../services/potential-moves.service";
import {APIService} from "../services/api.service";
import {pawnReachedEndRow} from "../functions/moving.functions";
import {repeat} from "../functions/helper.functions";

@Component({
  selector: 'chess-captured-pieces',
  template: `
    <div class="captured-piece" *ngFor="let piece of blackCapturedPieces">
      <img [src]="src(piece)"/>
    </div>
    <div class="captured-piece" *ngFor="let piece of whiteCapturedPieces">
      <img [src]="src(piece)"/>
    </div>
  `
})
export class CapturedPiecesComponent {
  capturedPiecesMap: {};
  whiteCapturedPieces: string[];
  blackCapturedPieces: string[];
  constructor(public drawing: DrawingService) {
    window["captured"] = this;
  }

  src(figure: string) {
    return `assets/images/pieces/${figure}.png`;
  }

  update() {
    this.capturedPiecesMap = this.drawing.capturedPiecesMap();
    this.whiteCapturedPieces = Object.keys(this.capturedPiecesMap)
      .filter(figure => figure.startsWith("w"))
      .flatMap(figure => repeat(figure, this.capturedPiecesMap[figure]));
    ;
    this.blackCapturedPieces = Object.keys(this.capturedPiecesMap).filter(figure => figure.startsWith("b"));
  }

}
