import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { UserDTO } from '../Models/user.dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlApi: string;
  private controller: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'api/user';
    this.urlApi = 'http://localhost:8000/' + this.controller; //Ruta local
    //this.urlApi = '/public/' + this.controller; //Ruta servidor
  }

  getLoggedUserData(headers: HttpHeaders): Observable<UserDTO> {
    return this.http
      .get<UserDTO>(this.urlApi + '/this', { headers: headers })
      .pipe(catchError(this.sharedService.handleError));
  }

  getUserById(user_id: string): Observable<UserDTO> {
    return this.http
      .get<UserDTO>(this.urlApi + '/' + user_id)
      .pipe(catchError(this.sharedService.handleError));
  }

  getUsers(): Observable<UserDTO[]> {
    return this.http
      .get<UserDTO[]>(this.urlApi)
      .pipe(catchError(this.sharedService.handleError));
  }

  createUser(user: UserDTO): Observable<UserDTO> {
    return this.http
      .post<UserDTO>(this.urlApi, user)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateUserImage(userId: string, image: File): Observable<Response> {
    const formData = new FormData();
    formData.append('foto', image);
    return this.http
      .post<Response>(this.urlApi + '/image/' + userId, formData)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateUser(userId: string, user: UserDTO): Observable<UserDTO> {
    return this.http
      .put<UserDTO>(this.urlApi + '/' + userId, user)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteUser(userId: string): Observable<UserDTO> {
    return this.http
      .delete<UserDTO>(this.urlApi + '/' + userId)
      .pipe(catchError(this.sharedService.handleError));
  }
}
