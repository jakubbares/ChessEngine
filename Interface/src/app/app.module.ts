import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import {BoardComponent} from "./components/board.component";
import {FigurePositionService} from "./services/figure-position.service";
import {DrawingService} from "./services/drawing.service";
import {PotentialMovesService} from "./services/potential-moves.service";
import {APIService} from "./services/api.service";
import { HttpClientModule } from "@angular/common/http";
import {CapturedPiecesComponent} from "./components/captured-pieces.component";
import {SettingsComponent} from "./components/settings.component";
import {GamesManagerComponent} from "./components/games-manager.component";
import {ChangeGameModal} from "./components/change-game.component";
import {ModalService} from "./services/modal.service";


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    CapturedPiecesComponent,
    SettingsComponent,
    GamesManagerComponent,
    ChangeGameModal
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    FigurePositionService,
    DrawingService,
    PotentialMovesService,
    APIService,
    ModalService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ChangeGameModal
  ],
})
export class AppModule { }
