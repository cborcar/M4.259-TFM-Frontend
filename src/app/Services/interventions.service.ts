import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { API_URL } from '../globals';
import { InterventionDTO } from '../Models/interventions.dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class InterventionsService {
  private urlApi: string = API_URL;
  private controller: string;
  private absoluteURL: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'api/interventions';
    this.absoluteURL = this.urlApi + this.controller;
  }

  getInterventionById(interventionId: string): Observable<InterventionDTO> {
    return this.http
      .get<InterventionDTO>(this.absoluteURL + '/' + interventionId)
      .pipe(catchError(this.sharedService.handleError));
  }

  getInterventionsByRequestId(
    requestId: string
  ): Observable<InterventionDTO[]> {
    return this.http
      .get<InterventionDTO[]>(this.absoluteURL + '/request/' + requestId)
      .pipe(catchError(this.sharedService.handleError));
  }

  createIntervention(
    intervention: InterventionDTO
  ): Observable<InterventionDTO> {
    return this.http
      .post<InterventionDTO>(this.absoluteURL, intervention)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateIntervention(
    interventionId: string,
    intervention: InterventionDTO
  ): Observable<InterventionDTO> {
    return this.http
      .put<InterventionDTO>(
        this.absoluteURL + '/' + interventionId,
        intervention
      )
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteIntervention(interventionId: string): Observable<InterventionDTO> {
    return this.http
      .delete<InterventionDTO>(this.absoluteURL + '/' + interventionId)
      .pipe(catchError(this.sharedService.handleError));
  }
}
