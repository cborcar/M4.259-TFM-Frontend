import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { InterventionDTO } from '../Models/interventions.dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class InterventionsService {
  private urlApi: string;
  private controller: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'api/interventions';
    this.urlApi = 'http://localhost:8000/' + this.controller; //Ruta local
    //this.urlApi = '/public/' + this.controller; //Ruta servidor
  }

  getInterventionById(interventionId: string): Observable<InterventionDTO> {
    return this.http
      .get<InterventionDTO>(this.urlApi + '/' + interventionId)
      .pipe(catchError(this.sharedService.handleError));
  }

  getInterventionsByRequestId(
    requestId: string
  ): Observable<InterventionDTO[]> {
    return this.http
      .get<InterventionDTO[]>(this.urlApi + '/request/' + requestId)
      .pipe(catchError(this.sharedService.handleError));
  }

  createIntervention(
    intervention: InterventionDTO
  ): Observable<InterventionDTO> {
    return this.http
      .post<InterventionDTO>(this.urlApi, intervention)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateIntervention(
    interventionId: string,
    intervention: InterventionDTO
  ): Observable<InterventionDTO> {
    return this.http
      .put<InterventionDTO>(this.urlApi + '/' + interventionId, intervention)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteIntervention(interventionId: string): Observable<InterventionDTO> {
    return this.http
      .delete<InterventionDTO>(this.urlApi + '/' + interventionId)
      .pipe(catchError(this.sharedService.handleError));
  }
}
