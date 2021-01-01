import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChessboardModule } from './modules/chessboard/chessboard.module';

import { AppComponent } from './app.component';
import {BoardComponent} from "./components/board.component";
import {FigurePositionService} from "./services/figure-position.service";
import {DrawingService} from "./services/drawing.service";
import {PotentialMovesService} from "./services/potential-moves.service";
import {APIService} from "./services/api.service";
import { HttpClientModule } from "@angular/common/http";


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ChessboardModule,
    HttpClientModule
  ],
  providers: [
    FigurePositionService,
    DrawingService,
    PotentialMovesService,
    APIService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
