import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {APIService} from "../services/api.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'chess-change-game',
  template: `
    <div class="container">
      <div class="row">
        <div class="col">
          <span>Enter your name:</span>
          <input [(ngModel)]="name" type="text"/>
          <button (click)="changeGame(name)">Create new game</button>
        </div>
        <div class="col">
          <div>Available games:</div>
          <button class="game-name" *ngFor="let game of allGames" (click)="changeGame(game)">{{game}}</button>
        </div>
      </div>
    </div>
  `
})
export class ChangeGameModal implements OnInit{
  name: string;
  allGames: string[];
  constructor(private apiService: APIService,
              private activeModal: NgbActiveModal) {
    window['enter_name'] = this;
  }

  ngOnInit(): void {
    this.loadGames();
  }

  changeGame(gameId: string): void {
    if (this.apiService.gameId !== gameId) {
      this.apiService.gameIdChanged.next(gameId);
    }
    this.activeModal.close('Game chosen');
  }

  loadGames(): void {
    this.apiService.getAllGames().subscribe((games: string[]) => {
      this.allGames = games;
    });
  }
}

