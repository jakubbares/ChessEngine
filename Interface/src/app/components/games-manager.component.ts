import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {APIService} from "../services/api.service";


@Component({
  selector: 'chess-games-manager',
  template: `
    <div class="games-manager">
      <div>Game: {{apiService.gameId}}</div>
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
