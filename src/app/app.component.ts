import {
  Component,
  HostListener,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { LoggedUserData } from './globals';
import { HeaderMenuDTO } from './Models/header-menu.dto';
import { HeaderMenuService } from './Services/header-menu.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
  isLogged: boolean;

  constructor(
    private router: Router,
    private headerMenusService: HeaderMenuService,
    private loggedUser: LoggedUserData
  ) {
    this.isLogged = localStorage.getItem('token') !== null;
  }

  ngOnInit(): void {
    //Si está logueado (existe token) muestra el menú y vamos a noticias.
    if (this.isLogged === true) {
      const headerInfo: HeaderMenuDTO = {
        showNavigationMenu: true,
      };
      this.headerMenusService.headerManagement.next(headerInfo);
      this.router.navigate(['/newsList']);
    }
  }

  @HostListener('window:beforeunload')
  beforeUnloadHandler() {
    if (this.loggedUser.remember == false) {
      localStorage.removeItem('token');
    }
  }
}
