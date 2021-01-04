import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {alphabet, Color, Figure, FigureImage, FigurePosition, numbers} from "../classes";
import {FigurePositionService} from "../services/figure-position.service";
import {DrawingService} from "../services/drawing.service";
import {PotentialMovesService} from "../services/potential-moves.service";
import {APIService} from "../services/api.service";
import {pawnReachedEndRow} from "../functions/moving.functions";
import {CapturedPiecesComponent} from "./captured-pieces.component";
import {EnterNameModal} from "./enter-name.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'chess-games-manager',
  template: `
    <div class="restart">
      <span>Game: {{name}}</span>
      <button (click)="changeGame()">Change game</button>
    </div>
  `
})
export class GamesManagerComponent {
  name: string;
  constructor(
    private apiService: APIService
  ) {
    this.name = this.apiService.gameId;
  }

  changeGame(): void {
    this.apiService.openGamesDialog();
  }
}
