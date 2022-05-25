import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedUserData } from 'src/app/globals';
import { NewsDTO } from 'src/app/Models/news.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { NewsService } from 'src/app/Services/news.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss'],
})
export class NewsListComponent implements OnInit {
  news!: NewsDTO[];
  showCreateButton!: boolean;
  showEmptyMessage: boolean;
  public loading;

  constructor(
    private router: Router,
    private newsService: NewsService,
    private userService: UserService,
    public loggedUser: LoggedUserData
  ) {
    this.showEmptyMessage = false;
    this.loading = true;
  }

  ngOnInit(): void {
    this.checkUserProfile();
    this.loadNews();
  }

  private checkUserProfile() {
    if (this.loggedUser.perfil != '') {
      if (
        this.loggedUser.perfil == 'Administrador' ||
        this.loggedUser.perfil == 'Participante'
      ) {
        this.showCreateButton = true;
      }
      //Cuando una persona recién se loguea, se lee este componente antes de que se escriban los datos de perfil en la clase global. En ese caso lo consulta.
    } else {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      });
      this.userService.getLoggedUserData(headers).subscribe({
        //complete: () => {},
        error: (error: HttpErrorResponse) => {
          console.log(error.error);
        },
        next: (user: UserDTO) => {
          if (user.perfil == 'Administrador' || user.perfil == 'Participante') {
            this.showCreateButton = true;
          }
        },
      });
    }
  }

  private loadNews(): void {
    this.newsService.getNews().subscribe({
      //complete: () => {},
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        console.log(error.error);
      },
      next: (news: NewsDTO[]) => {
        this.loading = false;
        this.news = news;
        if (this.news.length === 0) {
          this.showEmptyMessage = true;
        }
      },
    });
  }

  newsForm(newsId: string): void {
    this.router.navigateByUrl('news/' + newsId);
  }
}
