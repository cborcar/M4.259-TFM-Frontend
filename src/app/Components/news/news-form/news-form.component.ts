import { formatDate } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggedUserData } from 'src/app/globals';
import { NewsDTO } from 'src/app/Models/news.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { NewsService } from 'src/app/Services/news.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-news-form',
  templateUrl: './news-form.component.html',
  styleUrls: ['./news-form.component.scss'],
})
export class NewsFormComponent implements OnInit {
  noticia: NewsDTO;
  newsForm: FormGroup;
  titulo: FormControl;
  created_at: FormControl;
  descripcion: FormControl;
  autor: FormControl;
  canEdit: boolean;
  pressedSave: boolean;
  isReadOnly: boolean;
  isUpdateMode: boolean;

  public loading = false;
  private newsId: string | null;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private newsService: NewsService,
    private userService: UserService,
    private sharedService: SharedService,
    public loggedUser: LoggedUserData
  ) {
    this.newsId = this.activatedRoute.snapshot.paramMap.get('id');
    this.noticia = new NewsDTO('', '', new Date(), '');
    this.canEdit = false;
    this.isUpdateMode = false;
    this.pressedSave = false;
    this.isReadOnly = true;

    this.titulo = new FormControl('', [
      Validators.required,
      Validators.maxLength(60),
    ]);
    this.created_at = new FormControl('', [Validators.required]);
    this.autor = new FormControl('', [Validators.required]);
    this.descripcion = new FormControl('', [Validators.required]);

    this.newsForm = this.formBuilder.group({
      titulo: this.titulo,
      created_at: this.created_at,
      descripcion: this.descripcion,
      autor: this.autor,
    });
  }

  ngOnInit(): void {
    if (
      this.loggedUser.perfil == 'Administrador' ||
      this.loggedUser.perfil == 'Participante'
    ) {
      this.canEdit = true;
    }

    // update
    if (this.newsId) {
      this.isUpdateMode = true;
      this.loading = true;

      this.newsService.getNewsById(this.newsId).subscribe({
        //complete: () => {},
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.log(error.error);
        },
        next: (noticia: NewsDTO) => {
          this.noticia = noticia;

          this.titulo.setValue(this.noticia.titulo);
          this.descripcion.setValue(this.noticia.descripcion);
          this.created_at.setValue(
            formatDate(this.noticia.created_at, 'dd/MM/yyyy', 'en')
          );

          this.getNewsCreator(this.noticia.id_usuario);

          this.newsForm = this.formBuilder.group({
            titulo: this.titulo,
            descripcion: this.descripcion,
            created_at: this.created_at,
            autor: this.autor,
          });
        },
      });
    }
    //create new
    else {
      this.isReadOnly = false;
      this.created_at.setValue(formatDate(new Date(), 'dd/MM/yyyy', 'en'));

      this.noticia.id_usuario = this.loggedUser.id;
      this.autor.setValue(
        this.loggedUser.nombre + ' ' + this.loggedUser.apellidos
      );
    }
  }

  private getNewsCreator(userId: string): void {
    this.userService.getUserById(userId).subscribe({
      //complete: () => {},
      error: (error: HttpErrorResponse) => {
        console.log(error.error);
        this.loading = false;
      },
      next: (user: UserDTO) => {
        this.loading = false;
        this.autor.setValue(user.nombre + ' ' + user.apellidos);
      },
    });
  }

  saveNews(): void {
    this.pressedSave = true;

    if (this.newsForm.invalid) {
      return;
    }

    this.loading = true;
    this.noticia.titulo = this.titulo.value;
    this.noticia.descripcion = this.descripcion.value;

    if (this.isUpdateMode) {
      this.editNews();
    } else {
      this.createNews();
    }
  }

  private createNews(): void {
    let responseOK: boolean = false;

    if (this.noticia.id_usuario) {
      this.newsService.createNews(this.noticia).subscribe({
        complete: () => {
          if (responseOK) {
            this.sharedService.sendMessage({
              message: 'Noticia creada con éxito',
              type: 1,
            });
            this.router.navigateByUrl('newsList');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.log(error.error);
          this.sharedService.sendMessage({
            message: 'Ha habido un error al crear la noticia',
            type: 2,
          });
        },
        next: () => {
          responseOK = true;
          this.loading = false;
        },
      });
    }
  }

  activateEdit(): void {
    this.isReadOnly = false;
  }

  private editNews(): void {
    let responseOK: boolean = false;
    if (this.newsId) {
      this.newsService.updateNews(this.newsId, this.noticia).subscribe({
        complete: () => {
          if (responseOK) {
            this.sharedService.sendMessage({
              message: 'Noticia editada con éxito',
              type: 1,
            });
            this.router.navigateByUrl('newsList');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.log(error.error);
          this.sharedService.sendMessage({
            message: 'Ha habido un error al editar la noticia',
            type: 2,
          });
        },
        next: () => {
          this.loading = false;
          responseOK = true;
        },
      });
    }
  }

  deleteNews(newsId: string): void {
    // show confirmation popup
    let result = confirm('Confirma para borrar la noticia');
    if (result) {
      let responseOK: boolean = false;
      this.loading = true;
      this.newsService.deleteNews(newsId).subscribe({
        complete: () => {
          if (responseOK) {
            this.sharedService.sendMessage({
              message: 'Noticia eliminada con éxito',
              type: 1,
            });
            this.router.navigateByUrl('newsList');
          }
        },
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.log(error.error);
          this.sharedService.sendMessage({
            message: 'Ha habido un error al eliminar la noticia',
            type: 2,
          });
        },
        next: () => {
          this.loading = false;
          responseOK = true;
        },
      });
    }
  }
}
