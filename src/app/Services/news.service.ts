import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { NewsDTO } from '../Models/news.dto';
import { SharedService } from './shared.service';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  private urlApi: string;
  private controller: string;

  constructor(private http: HttpClient, private sharedService: SharedService) {
    this.controller = 'api/news';
    this.urlApi = 'http://localhost:8000/' + this.controller; //Ruta local
    //this.urlApi = '/public/' + this.controller; //Ruta servidor
  }

  getNews(): Observable<NewsDTO[]> {
    return this.http
      .get<NewsDTO[]>(this.urlApi)
      .pipe(catchError(this.sharedService.handleError));
  }

  getNewsById(newsId: string): Observable<NewsDTO> {
    return this.http
      .get<NewsDTO>(this.urlApi + '/' + newsId)
      .pipe(catchError(this.sharedService.handleError));
  }

  getNewsPaginate(pageNumber: string): Observable<NewsDTO[]> {
    return this.http
      .get<NewsDTO[]>(this.urlApi + '/page/' + pageNumber)
      .pipe(catchError(this.sharedService.handleError));
  }

  createNews(noticia: NewsDTO): Observable<NewsDTO> {
    return this.http
      .post<NewsDTO>(this.urlApi, noticia)
      .pipe(catchError(this.sharedService.handleError));
  }

  updateNews(newsId: string, news: NewsDTO): Observable<NewsDTO> {
    return this.http
      .put<NewsDTO>(this.urlApi + '/' + newsId, news)
      .pipe(catchError(this.sharedService.handleError));
  }

  deleteNews(newsId: string): Observable<NewsDTO> {
    return this.http
      .delete<NewsDTO>(this.urlApi + '/' + newsId)
      .pipe(catchError(this.sharedService.handleError));
  }
}
