import {Component, OnInit, ViewChild} from '@angular/core';
import {DrawingService} from "./services/drawing.service";
import {CapturedPiecesComponent} from "./components/captured-pieces.component";
import {BoardComponent} from "./components/board.component";
import {APIService} from "./services/api.service";
import {FigurePositionService} from "./services/figure-position.service";
import {BoardData} from "./classes";
import {ModalService} from "./services/modal.service";

@Component({
  selector: 'chess-root',
  template: `
    <div class="app">
      <div class="board" [style.width.px]="drawing.board.length">
        <chess-board (moveMade)="moveMade()"></chess-board>
      </div>
      <div class="options">
        <chess-games-manager></chess-games-manager>
        <div *ngIf="winner.length" class="winner-sign">Winner is {{winner}}</div>
        <chess-settings></chess-settings>
        <button class="back" (click)="backAMove()">Back</button>
        <chess-captured-pieces></chess-captured-pieces>
      </div>
    </div>
  `
})
export class AppComponent implements OnInit {
  winner = "";
  @ViewChild(CapturedPiecesComponent, { static: true }) private capturedPieces: CapturedPiecesComponent;
  @ViewChild(BoardComponent, { static: true }) private board: BoardComponent;
  constructor(
    private apiService: APIService,
    public drawing: DrawingService,
    private modalService: ModalService,
    public position: FigurePositionService,
  ) {
    this.checkForGameName();
  }

  ngOnInit(): void {
    this.board.getHighlights();
    this.apiService.getFigurePositions().subscribe((data: BoardData) => {
      this.position.loadFigurePositionsFromDict(data.board);
      this.board.turn = data.turn;
      this.board.drawPieces();
      this.board.getHighlights();
      this.hasWinner();
      this.capturedPieces.update();
    });
  }

  restart(): void {
    this.apiService.gameIdChanged.subscribe((gameId) => {
      this.apiService.getOrCreateGame(gameId).subscribe((data: BoardData) => {
        this.position.loadFigurePositionsFromDict(data.board);
        this.board.turn = data.turn;
        this.board.drawPieces();
        this.board.getHighlights();
        this.capturedPieces.update();
      });
    });
  }

  moveMade(): void {
    this.capturedPieces.update();
  }

  backAMove(): void {
    this.apiService.backAMove().subscribe((data: BoardData) => {
      this.position.loadFigurePositionsFromDict(data.board);
      this.board.turn = data.turn;
      this.board.drawPieces();
      this.board.getHighlights();
      this.capturedPieces.update();
    });
  }

  hasWinner(): void {
    this.apiService.getHasWinner().subscribe((winner) => {
      this.winner = winner ? winner : "";
    });
  }

  checkForGameName(): void {
    if (window.localStorage.getItem("gameId") === null) {
      this.modalService.openGamesDialog();
    }
  }

}

