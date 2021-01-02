import { Component } from '@angular/core';
import {alphabet, Color, Figure, FigureImage, FigurePosition, numbers} from "../classes";
import {FigurePositionService} from "../services/figure-position.service";
import {DrawingService} from "../services/drawing.service";
import {PotentialMovesService} from "../services/potential-moves.service";
import {APIService} from "../services/api.service";
import {pawnReachedEndRow} from "../functions/moving.functions";
import {repeatString} from "../functions/helper.functions";
import {getCapturedPiecesFromCountMap} from "../functions/board.functions";

@Component({
  selector: 'chess-captured-pieces',
  template: `
    <div class="captured-pieces-container">
      <div class="captured-piece" *ngFor="let piece of blackCapturedPieces">
        <img [src]="src(piece)"/>
      </div>
    </div>
    <div class="captured-pieces-container">
      <div class="captured-piece" *ngFor="let piece of whiteCapturedPieces">
        <img [src]="src(piece)"/>
      </div>
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

  src(figure: string): string {
    return `assets/images/pieces/${figure}.png`;
  }

  update(): void {
    this.capturedPiecesMap = this.drawing.capturedPiecesMap();
    this.whiteCapturedPieces = getCapturedPiecesFromCountMap(this.capturedPiecesMap, "white");
    this.blackCapturedPieces = getCapturedPiecesFromCountMap(this.capturedPiecesMap, "black");
  }

}
