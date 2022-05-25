import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { AuthDTO, TokenDTO } from '../Models/auth.dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlApi: string;
  private controller: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'oauth/token';
    this.urlApi = 'http://localhost:8000/' + this.controller; //Ruta local
    //this.urlApi = '/public/' + this.controller; //Ruta servidor
  }

  login(data: AuthDTO): Observable<TokenDTO> {
    return this.http
      .post<TokenDTO>(this.urlApi, data)
      .pipe(catchError(this.sharedService.handleError));
  }
}
