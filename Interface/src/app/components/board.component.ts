import { Component } from '@angular/core';
import {alphabet, Color, FigureImage, FigurePosition, numbers} from "../classes";
import {FigurePositionService} from "../services/figure-position.service";
import {DrawingService} from "../services/drawing.service";
import {PotentialMovesService} from "../services/potential-moves.service";
import {APIService} from "../services/api.service";
import {pawnReachedEndRow} from "../functions/moving.functions";

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
             [style.width]="drawing.board.squareLength"
             [style.left.px]="figure.coors.x"
             [style.top.px]="figure.coors.y"
             (click)="chooseFigure(figure)"/>
      </div>
      <div *ngIf="winner.length"
           [style.top.px]="drawing.board.length + 20"
           class="winner-sign">Winner is {{winner}}
      </div>
      <button class="back" (click)="backAMove()" [style.top.px]="-drawing.board.length" [style.left.px]="drawing.board.length + 20">Back</button>
    </div>
  `
})
export class BoardComponent {
  alphabet = alphabet;
  numbers = numbers.reverse();
  figureImages: FigureImage[] = [];
  chosenFigure: FigureImage;
  highlightsMap: {};
  turn: Color = "white";
  heroColor: Color = "white";
  winner = "";
  constructor(public position: FigurePositionService,
              public moves: PotentialMovesService,
              private apiService: APIService,
              public drawing: DrawingService) {
    window["board"] = this;
    this.getHighlights();
    this.apiService.getFigurePositions().subscribe((boardDict) => {
      this.position.loadFigurePositionsFromDict(boardDict);
      this.figureImages = this.drawing.drawPieces();
      this.getHighlights();
      this.hasWinner();
    });
  }

  hasWinner() {
    this.apiService.getHasWinner().subscribe((winner) => {
      this.winner = winner ? winner : "";
    });
  }

  backAMove() {
    this.apiService.backAMove().subscribe((boardDict) => {
      this.position.loadFigurePositionsFromDict(boardDict);
      this.figureImages = this.drawing.drawPieces();
    });
  }

  postMove() {
    this.figureImages = this.drawing.drawPieces();
    this.turn = this.turn === "black" ? "white" : "black";
    this.highlightsMap = {};
  }

  isOpponentFigure(letter, number) {
    if (this.position.figuresMap.hasOwnProperty(letter + number)) {
      const position = this.position.figuresMap[letter + number];
      return position.color !== this.heroColor;
    }
    return false;
  }

  moveChosenFigureToField(letter, number) {
    if (!this.highlightsMap[letter + number]) return;
    const figure = this.chosenFigure.position;
    if (figure.color !== this.turn) return;
    if (figure.color === this.heroColor) {
      const moveTo = new FigurePosition().fromStr(letter + number);
      const isPromotion = pawnReachedEndRow(figure, number) ? 1 : 0;
      this.apiService.makeHeroMove(figure.fieldNumber, moveTo.fieldNumber, isPromotion).subscribe((boardDict) => {
        this.position.loadFigurePositionsFromDict(boardDict);
        this.postMove();
        this.hasWinner();
        if (this.winner) return;
        this.apiService.makeComputerMove().subscribe((boardDictAfter) => {
          this.position.loadFigurePositionsFromDict(boardDictAfter);
          this.postMove();
          this.hasWinner();
        });
      });
    }
  }

  makeComputerMoveFromUCI(moveUCI: string) {
    const fromPosition = moveUCI.substr(0,2);
    const toPosition = moveUCI.substr(2,2);
    this.chosenFigure = this.figureImages.find(figureImage => {
      console.log(fromPosition)
      console.log(figureImage)
      return figureImage.position.str === fromPosition;
    });
    console.log(this.chosenFigure)
    delete this.position.figuresMap[fromPosition];
    const figure = this.chosenFigure.position;
    figure.fromStr(toPosition);
    this.position.figuresMap[toPosition] = figure;
    this.postMove();
  }

  findPotentialMoves(): FigurePosition[] {
    return this.chosenFigure ?
      this.moves.fieldsToMove(this.chosenFigure.position)
        .filter(move => this.chosenFigure.piece === 'N' || this.moves.isMoveLegal(this.chosenFigure.position, move)) : [];
  }

  getHighlights() {
    const potentialMoves = this.findPotentialMoves().map((move: FigurePosition)  => move.str);
    this.highlightsMap = this.moves.fields.reduce((map, field) => {
      map[field] = potentialMoves.includes(field);
      return map;
    }, {});
  }

  chooseFigure(figure: FigureImage) {
    if (this.turn !== figure.position.color) {
      this.moveChosenFigureToField(figure.position.letter, figure.position.number);
      return;
    }
    this.chosenFigure = figure;
    this.getHighlights();
  }

  boardColor(letter, number) {
    const letterIndex = alphabet.indexOf(letter);
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

  standardBoardColor(letterIndex, number, dark= "gray", light= "white") {
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

