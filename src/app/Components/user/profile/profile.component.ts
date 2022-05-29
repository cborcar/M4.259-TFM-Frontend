import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoggedUserData, STORAGE_URL } from 'src/app/globals';
import { HeaderMenuDTO } from 'src/app/Models/header-menu.dto';
import { HeaderMenuService } from 'src/app/Services/header-menu.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  nombre: FormControl;
  apellidos: FormControl;
  email: FormControl;
  perfil: FormControl;
  storageURL: string = STORAGE_URL;

  userForm: FormGroup;
  profilePicture: string;
  showOtherUsersButton: boolean;
  userId: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private headerMenusService: HeaderMenuService,
    private loggedUser: LoggedUserData
  ) {
    this.profilePicture = 'blank.png';
    this.showOtherUsersButton = false;

    this.userId = this.loggedUser.id;
    this.nombre = new FormControl('');
    this.apellidos = new FormControl('');
    this.email = new FormControl('');
    this.perfil = new FormControl('');

    this.userForm = this.formBuilder.group({
      nombre: this.nombre,
      apellidos: this.apellidos,
      email: this.email,
      perfil: this.perfil,
    });
  }

  ngOnInit(): void {
    console.log(this.loggedUser.foto);
    this.nombre.setValue(this.loggedUser.nombre);
    this.apellidos.setValue(this.loggedUser.apellidos);
    this.profilePicture = this.storageURL + this.loggedUser.foto;
    this.email.setValue(this.loggedUser.email);
    this.perfil.setValue(this.loggedUser.perfil);
    if (this.loggedUser.perfil === 'Administrador') {
      this.showOtherUsersButton = true;
    }
  }

  editUser(userId: string): void {
    this.router.navigateByUrl('user/' + userId);
  }

  userList() {
    this.router.navigateByUrl('userList');
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
