import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { API_URL } from '../globals';
import { NewsDTO } from '../Models/news.dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private urlApi: string = API_URL;
  private controller: string;
  private absoluteURL: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'api/news';
    this.absoluteURL = this.urlApi + this.controller;
  }

  getNews(): Observable<NewsDTO[]> {
    return this.http
      .get<NewsDTO[]>(this.absoluteURL)
      .pipe(catchError(this.sharedService.handleError));
  }

  getNewsById(newsId: string): Observable<NewsDTO> {
    return this.http
      .get<NewsDTO>(this.absoluteURL + '/' + newsId)
      .pipe(catchError(this.sharedService.handleError));
  }

  getNewsPaginate(pageNumber: string): Observable<NewsDTO[]> {
    return this.http
      .get<NewsDTO[]>(this.absoluteURL + '/page/' + pageNumber)
      .pipe(catchError(this.sharedService.handleError));
  }

  createNews(noticia: NewsDTO): Observable<NewsDTO> {
    return this.http
      .post<NewsDTO>(this.absoluteURL, noticia)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateNews(newsId: string, news: NewsDTO): Observable<NewsDTO> {
    return this.http
      .put<NewsDTO>(this.absoluteURL + '/' + newsId, news)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteNews(newsId: string): Observable<NewsDTO> {
    return this.http
      .delete<NewsDTO>(this.absoluteURL + '/' + newsId)
      .pipe(catchError(this.sharedService.handleError));
  }
}
