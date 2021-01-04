import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from '@angular/common/http';
import {Observable, Subject} from 'rxjs';
import {ChangeGameModal} from "../components/change-game.component";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ModalService} from "./modal.service";

@Injectable()
export class APIService {
  gameIdChanged = new Subject<string>();
  gameId: string;
  defaultGameId = "default";
  private baseUrl = `${environment.apiUrl}/${this.defaultGameId}`;
  constructor(
    private http: HttpClient,
  ) {
    this.gameId = window.localStorage.getItem("gameId");
    this.gameIdChanged.asObservable().subscribe((gameId: string) => {
      this.updateGameId(gameId);
    });
  }

  updateGameId(id: string): void {
    this.gameId = id;
    this.baseUrl = `${environment.apiUrl}/${this.gameId}`;
    window.localStorage.setItem("gameId", id);
  }

  getAllGames(): Observable<any> {
    return this.http.get(`${environment.apiUrl}/games`);
  }

  getOrCreateGame(gameId: string): Observable<any> {
    this.updateGameId(gameId);
    return this.http.get(this.baseUrl + '/game/get-or-create');
  }

  restart(): Observable<any> {
    return this.http.get(this.baseUrl + '/restart');
  }

  legalMoves(): Observable<any> {
    return this.http.get(this.baseUrl + '/move/legal');
  }

  getDepth(): Observable<any> {
    return this.http.get(this.baseUrl + '/settings/depth');
  }

  setDepth(depth: number): Observable<any> {
    return this.http.get(this.baseUrl + '/settings/depth/' + depth);
  }

  getHasWinner(): Observable<any> {
    return this.http.get(this.baseUrl + '/winner');
  }

  getFigurePositions(): Observable<any> {
    return this.http.get(this.baseUrl + '/board');
  }

  backAMove(): Observable<any> {
    return this.http.get(this.baseUrl + '/move/back');
  }

  makeHeroMove(moveFrom: number, moveTo: number, promotion= 0): Observable<any> {
    return this.http.get(this.baseUrl + '/move/hero/from/' + moveFrom + '/to/' + moveTo + '/' + promotion);
  }

  makeComputerMove(): Observable<any> {
    return this.http.get(this.baseUrl + '/move/computer');
  }
}


