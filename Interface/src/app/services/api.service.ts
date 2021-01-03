import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable()
export class APIService {
  private baseUrl = `${environment.apiUrl}`;
  constructor(private http: HttpClient) {
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


