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
  selector: 'chess-settings',
  template: `
    <span>Computer depth</span>
    <button (click)="setDepth(true)">+</button>
    {{computerMovesDepth}}
    <button (click)="setDepth(false)">-</button>
  `
})
export class SettingsComponent {
  computerMovesDepth = 4;
  constructor(private apiService: APIService) {
    this.apiService.getDepth().subscribe((depth) => {
      this.computerMovesDepth = depth;
    });
  }

  setDepth(increase: boolean): void {
    this.computerMovesDepth += increase ? 1 : -1;
    this.apiService.setDepth(this.computerMovesDepth).subscribe((message) => {
      console.log(message);
    });
  }

}
