import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {APIService} from "../services/api.service";


@Component({
  selector: 'chess-games-manager',
  template: `
    <div class="restart">
      <span>Game: {{apiService.gameId}}</span>
      <button (click)="changeGame()">Change game</button>
    </div>
  `
})
export class GamesManagerComponent {
  constructor(
    public apiService: APIService
  ) {
  }

  changeGame(): void {
    this.apiService.openGamesDialog();
  }
}
