import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedUserData } from 'src/app/globals';
import { HeaderMenuDTO } from 'src/app/Models/header-menu.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { HeaderMenuService } from 'src/app/Services/header-menu.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showNavigationMenu: boolean;

  constructor(
    private router: Router,
    private headerMenusService: HeaderMenuService,
    private userService: UserService,
    public loggedUser: LoggedUserData
  ) {
    this.showNavigationMenu = false;
  }

  ngOnInit(): void {
    //Llega aquí tras comprobar si el usuario está logueado en "app.component.ts" y muestra el menú si corresponde.
    this.headerMenusService.headerManagement.subscribe(
      (headerInfo: HeaderMenuDTO) => {
        if (headerInfo) {
          this.showNavigationMenu = headerInfo.showNavigationMenu;
        }
      }
    );

    if (this.showNavigationMenu === false) {
      this.router.navigateByUrl('login'); //El usuario no está logueado, vamos a login.
    } else {
      //El usuario arranca la aplicación y está logueado. Cargamos sus datos.
      const headers = new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      });

      this.userService.getLoggedUserData(headers).subscribe({
        error: (error: HttpErrorResponse) => {
          console.log(error.error);
          this.logout(); //Si por alguna razón, no podemos obtener los datos del usuario, cerramos la sesión completamente.
        },
        next: (user: UserDTO) => {
          this.loggedUser.id = user.id;
          this.loggedUser.nombre = user.nombre;
          this.loggedUser.apellidos = user.apellidos;
          this.loggedUser.email = user.email;
          this.loggedUser.foto = user.foto;
          this.loggedUser.perfil = user.perfil;
          this.loggedUser.remember = true;
        },
      });
    }
  }

  news(): void {
    this.router.navigateByUrl('newsList');
  }

  request(): void {
    this.router.navigateByUrl('requestList');
  }

  userProfile(): void {
    this.router.navigateByUrl('profile');
  }

  logout(): void {
    this.loggedUser.id = '';
    this.loggedUser.nombre = '';
    this.loggedUser.apellidos = '';
    this.loggedUser.perfil = '';
    this.loggedUser.email = '';
    this.loggedUser.foto = '';
    this.loggedUser.remember = false;
    localStorage.removeItem('token');
    const headerInfo: HeaderMenuDTO = { showNavigationMenu: false };
    this.headerMenusService.headerManagement.next(headerInfo);

    this.router.navigateByUrl('login');
  }
}
