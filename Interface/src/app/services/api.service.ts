import {Injectable} from "@angular/core";
import {environment} from "../../environments/environment";
import {HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable()
export class APIService {
  private baseUrl = `${environment.apiUrl}/move`;
  constructor(private http: HttpClient) {
  }

  getHasWinner(): Observable<any> {
    return this.http.get(this.baseUrl + '/winner');
  }

  getFigurePositions(): Observable<any> {
    return this.http.get(this.baseUrl + '/board');
  }

  backAMove(): Observable<any> {
    return this.http.get(this.baseUrl + '/back');
  }

  makeHeroMove(moveFrom: number, moveTo: number, promotion= 0): Observable<any> {
    return this.http.get(this.baseUrl + '/hero/from/' + moveFrom + '/to/' + moveTo + '/' + promotion);
  }

  makeComputerMove(): Observable<any> {
    return this.http.get(this.baseUrl + '/computer');
  }
}


