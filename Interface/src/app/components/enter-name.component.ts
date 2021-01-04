import {
  Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges,
  ViewChild
} from '@angular/core';
import {APIService} from "../services/api.service";

@Component({
  selector: 'chess-enter-name',
  template: `
    <div class="row">
      <div class="col">
        <span>Enter your name:</span>
        <input [(ngModel)]="name" type="text"/>
        <button (click)="changeGame(name)">Create new game</button>
      </div>
      <div class="col">
        <div>Available games</div>
        <div *ngFor="let game of allGames" (click)="changeGame(game)">{{game}}</div>
      </div>
    </div>

  `
})
export class EnterNameModal implements OnInit{
  name: string;
  allGames: string[];
  constructor(private apiService: APIService) {
    window['enter_name'] = this;
  }

  ngOnInit(): void {
    this.loadGames();
  }

  changeGame(gameId: string): void {
    if (this.apiService.gameId !== gameId) {
      this.apiService.gameIdChanged.next(gameId);
    }
  }

  loadGames(): void {
    this.apiService.getAllGames().subscribe((games: string[]) => {
      this.allGames = games;
    });
  }
}

