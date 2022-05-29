import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { API_URL } from '../globals';
import { RequestDTO } from '../Models/request.dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  private urlApi: string = API_URL;
  private controller: string;
  private absoluteURL: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'api/requests';
    this.absoluteURL = this.urlApi + this.controller;
  }

  getRequests(): Observable<RequestDTO[]> {
    return this.http
      .get<RequestDTO[]>(this.absoluteURL)
      .pipe(catchError(this.sharedService.handleError));
  }

  getRequestById(requestId: string): Observable<RequestDTO> {
    return this.http
      .get<RequestDTO>(this.absoluteURL + '/' + requestId)
      .pipe(catchError(this.sharedService.handleError));
  }

  getRequestByStatus(status: string): Observable<RequestDTO[]> {
    return this.http
      .get<RequestDTO[]>(this.absoluteURL + '/status/' + status)
      .pipe(catchError(this.sharedService.handleError));
  }

  createRequest(request: RequestDTO): Observable<RequestDTO> {
    return this.http
      .post<RequestDTO>(this.absoluteURL, request)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateRequest(
    requestId: string,
    request: RequestDTO
  ): Observable<RequestDTO> {
    return this.http
      .put<RequestDTO>(this.absoluteURL + '/' + requestId, request)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateRequestStatus(
    requestId: string,
    status: string
  ): Observable<RequestDTO> {
    return this.http
      .put<RequestDTO>(
        this.absoluteURL + '/' + requestId + '/status/' + status,
        ''
      )
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteRequest(requestId: string): Observable<RequestDTO> {
    return this.http
      .delete<RequestDTO>(this.absoluteURL + '/' + requestId)
      .pipe(catchError(this.sharedService.handleError));
  }
}
