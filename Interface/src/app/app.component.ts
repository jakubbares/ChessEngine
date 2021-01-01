import { Component } from '@angular/core';

@Component({
  selector: 'chess-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'app';
  position: any = 'start';
  orientation: Boolean = true;
  showNotation: Boolean = true;
  draggable: Boolean = true;
  animation: Boolean = true;

  constructor() {
  }

  dragMove(move) {
    this.checkValidity(move)
    console.log(move);
  }

  checkValidity({newLocation, oldLocation, source, piece, position, orientation}) {

  }
}

