import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { API_URL } from '../globals';
import { UserDTO } from '../Models/user.dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlApi: string = API_URL;
  private controller: string;
  private absoluteURL: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'api/user';
    this.absoluteURL = this.urlApi + this.controller;
  }

  getLoggedUserData(headers: HttpHeaders): Observable<UserDTO> {
    return this.http
      .get<UserDTO>(this.absoluteURL + '/this', { headers: headers })
      .pipe(catchError(this.sharedService.handleError));
  }

  getUserById(user_id: string): Observable<UserDTO> {
    return this.http
      .get<UserDTO>(this.absoluteURL + '/' + user_id)
      .pipe(catchError(this.sharedService.handleError));
  }

  getUsers(): Observable<UserDTO[]> {
    return this.http
      .get<UserDTO[]>(this.absoluteURL)
      .pipe(catchError(this.sharedService.handleError));
  }

  createUser(user: UserDTO): Observable<UserDTO> {
    return this.http
      .post<UserDTO>(this.absoluteURL, user)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateUserImage(userId: string, image: File): Observable<Response> {
    const formData = new FormData();
    formData.append('foto', image);
    return this.http
      .post<Response>(this.absoluteURL + '/image/' + userId, formData)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateUser(userId: string, user: UserDTO): Observable<UserDTO> {
    return this.http
      .put<UserDTO>(this.absoluteURL + '/' + userId, user)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteUser(userId: string): Observable<UserDTO> {
    return this.http
      .delete<UserDTO>(this.absoluteURL + '/' + userId)
      .pipe(catchError(this.sharedService.handleError));
  }
}
