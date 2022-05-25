import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { RequestDTO } from '../Models/request.dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private urlApi: string;
  private controller: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'api/requests';
    this.urlApi = 'http://localhost:8000/' + this.controller; //Ruta local
    //this.urlApi = '/public/' + this.controller; //Ruta servidor
  }

  getRequests(): Observable<RequestDTO[]> {
    return this.http
      .get<RequestDTO[]>(this.urlApi)
      .pipe(catchError(this.sharedService.handleError));
  }

  getRequestById(requestId: string): Observable<RequestDTO> {
    return this.http
      .get<RequestDTO>(this.urlApi + '/' + requestId)
      .pipe(catchError(this.sharedService.handleError));
  }

  getRequestByStatus(status: string): Observable<RequestDTO[]> {
    return this.http
      .get<RequestDTO[]>(this.urlApi + '/status/' + status)
      .pipe(catchError(this.sharedService.handleError));
  }

  createRequest(request: RequestDTO): Observable<RequestDTO> {
    return this.http
      .post<RequestDTO>(this.urlApi, request)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateRequest(
    requestId: string,
    request: RequestDTO
  ): Observable<RequestDTO> {
    return this.http
      .put<RequestDTO>(this.urlApi + '/' + requestId, request)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateRequestStatus(
    requestId: string,
    status: string
  ): Observable<RequestDTO> {
    return this.http
      .put<RequestDTO>(this.urlApi + '/' + requestId + '/status/' + status, '')
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteRequest(requestId: string): Observable<RequestDTO> {
    return this.http
      .delete<RequestDTO>(this.urlApi + '/' + requestId)
      .pipe(catchError(this.sharedService.handleError));
  }
}
