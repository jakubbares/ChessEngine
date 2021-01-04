import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {alphabet, BoardData, Color, Figure, FigureImage, FigurePosition, numbers} from "../classes";
import {FigurePositionService} from "../services/figure-position.service";
import {DrawingService} from "../services/drawing.service";
import {PotentialMovesService} from "../services/potential-moves.service";
import {APIService} from "../services/api.service";
import {pawnReachedEndRow} from "../functions/moving.functions";
import {CapturedPiecesComponent} from "./captured-pieces.component";

@Component({
  selector: 'chess-board',
  template: `
    <div class="container">
      <div *ngFor="let number of numbers" class="row board"
           [style.width.px]="drawing.board.length">
        <div *ngFor="let letter of alphabet"
             class="col" [style.width.px]="drawing.board.squareLength"
             [style.height.px]="drawing.board.squareLength"
             [style.background-color]="boardColor(letter, number)"
             (click)="moveChosenFigureToField(letter, number)">
        </div>
      </div>
      <div class="figures"
           [style.width.px]="drawing.board.length"
           [style.height.px]="drawing.board.length">
        <img class="figure"
             *ngFor="let figure of figureImages"
             [src]="figure.imageSrc"
             [style.width.px]="drawing.board.squareLength"
             [style.left.px]="figure.coors.x"
             [style.top.px]="figure.coors.y"
             (click)="chooseFigure(figure)"/>
      </div>
    </div>
  `
})
export class BoardComponent {
  alphabet = alphabet;
  numbers = numbers.reverse();
  figureImages: FigureImage[] = [];
  chosenFigure: FigureImage;
  allFiguresLegalMoves: string[] = [];
  highlightsMap: {} = {};
  turn: Color = "white";
  heroColor: Color = "white";
  @Output() moveMade = new EventEmitter<boolean>();
  constructor(public position: FigurePositionService,
              public moves: PotentialMovesService,
              private apiService: APIService,
              public drawing: DrawingService) {
    window["board"] = this;
    this.apiService.gameIdChanged.asObservable().subscribe((gameId: string) => {
      this.apiService.getOrCreateGame(gameId).subscribe((data: BoardData) => {
        this.position.loadFigurePositionsFromDict(data.board);
        this.turn = data.turn;
        this.figureImages = this.drawing.drawPieces();
      });
    });
    setInterval(() => {
      // this.update();
    }, 2000);
  }

  update(): void {
    this.apiService.getFigurePositions().subscribe((data: BoardData) => {
      this.position.loadFigurePositionsFromDict(data.board);
      this.turn = data.turn;
      this.figureImages = this.drawing.drawPieces();
    });
  }

  drawPieces(): void {
    this.figureImages = this.drawing.drawPieces();
  }

  postMove(): void {
    this.figureImages = this.drawing.drawPieces();
    this.turn = this.turn === "black" ? "white" : "black";
    this.highlightsMap = {};
    this.moveMade.emit(true);
  }

  isOpponentFigure(letter, number): boolean {
    if (this.position.figuresMap.hasOwnProperty(letter + number)) {
      const position = this.position.figuresMap[letter + number];
      return position.color !== this.heroColor;
    }
    return false;
  }

  moveChosenFigureToField(letter, number): void {
    if (!this.highlightsMap[letter + number]) return;
    const figure = this.chosenFigure.position;
    if (figure.color !== this.turn) return;
    if (figure.color === this.heroColor) {
      const moveTo = new FigurePosition().fromStr(letter + number);
      const isPromotion = pawnReachedEndRow(figure, number) ? 1 : 0;
      this.apiService.makeHeroMove(figure.fieldNumber, moveTo.fieldNumber, isPromotion).subscribe((data: BoardData) => {
        this.position.loadFigurePositionsFromDict(data.board);
        this.postMove();
        this.apiService.makeComputerMove().subscribe((dataAfter: BoardData) => {
          this.position.loadFigurePositionsFromDict(dataAfter.board);
          this.postMove();
        });
      });
    }
  }

  makeComputerMoveFromUCI(moveUCI: string): void {
    const fromPosition = moveUCI.substr(0,2);
    const toPosition = moveUCI.substr(2,2);
    this.chosenFigure = this.figureImages.find(figureImage => {
      return figureImage.position.str === fromPosition;
    });
    delete this.position.figuresMap[fromPosition];
    const figure = this.chosenFigure.position;
    figure.fromStr(toPosition);
    this.position.figuresMap[toPosition] = figure;
    this.postMove();
  }

  getHighlights(): void {
    this.apiService.legalMoves().subscribe((movesUci) => {
      this.allFiguresLegalMoves = movesUci;
      this.highlightsMap = this.moves.fields.reduce((map, field) => {
        map[field] = movesUci.filter(moveUci => {
          const fromPosition = moveUci.substr(0, 2);
          const toPosition = moveUci.substr(2, 2);
          return this.chosenFigure && this.chosenFigure.position.str === fromPosition && field === toPosition;
        }).length > 0;
        return map;
      }, {});
    });
  }

  chooseFigure(figure: FigureImage): void {
    this.moveChosenFigureToField(figure.position.letter, figure.position.number);
    this.chosenFigure = figure;
    this.getHighlights();
  }

  boardColor(letter, number): string {
    const letterIndex = alphabet.indexOf(letter);
    if (!this.highlightsMap.hasOwnProperty(letter + number)) {
      return this.standardBoardColor(letterIndex, number);
    }
    let dark = this.highlightsMap[letter + number] ? "#729c91" : "grey";
    let light = this.highlightsMap[letter + number] ? "#d0f2f0" : "white";
    if (this.turn !== this.heroColor && this.isOpponentFigure(letter, number)) {
      return this.standardBoardColor(letterIndex, number);
    }
    if (this.chosenFigure && this.chosenFigure.position.str === letter + number
      && this.turn === this.chosenFigure.position.color) {
      light = "red"; dark = "red";
    }
    return this.standardBoardColor(letterIndex, number, dark, light);
  }

  standardBoardColor(letterIndex, number, dark= "gray", light= "white"): string {
    if (letterIndex % 2 === 1 && number % 2 === 1) {
      return dark;
    } else if (letterIndex % 2 === 0 && number % 2 === 0) {
      return dark;
    } else if (letterIndex % 2 === 0 && number % 2 === 1) {
      return light;
    } else if (letterIndex % 2 === 1 && number % 2 === 0) {
      return light;
    }
  }
}

