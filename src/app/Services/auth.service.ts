import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { API_URL } from '../globals';
import { AuthDTO, TokenDTO } from '../Models/auth.dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlApi: string = API_URL;
  private controller: string;
  private absoluteURL: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'oauth/token';
    this.absoluteURL = this.urlApi + this.controller;
  }

  login(data: AuthDTO): Observable<TokenDTO> {
    return this.http
      .post<TokenDTO>(this.absoluteURL, data)
      .pipe(catchError(this.sharedService.handleError));
  }
}
