import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoggedUserData } from 'src/app/globals';
import { AuthDTO } from 'src/app/Models/auth.dto';
import { HeaderMenuDTO } from 'src/app/Models/header-menu.dto';
import { UserDTO } from 'src/app/Models/user.dto';
import { AuthService } from 'src/app/Services/auth.service';
import { HeaderMenuService } from 'src/app/Services/header-menu.service';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  email: FormControl;
  password: FormControl;
  rememberCheck: FormControl;
  loginUser: AuthDTO;
  pressedLogin: boolean;
  public loading = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenuService,
    private userService: UserService,
    public loggedUser: LoggedUserData
  ) {
    this.loginUser = new AuthDTO('', '');
    this.pressedLogin = false;

    this.email = new FormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]);

    this.rememberCheck = new FormControl(false);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
      rememberCheck: this.rememberCheck,
    });
  }

  ngOnInit(): void {}

  submit() {
    this.pressedLogin = true;
    if (this.loginForm.valid) {
      this.loading = true;
      this.loginUser.username = this.email.value;
      this.loginUser.password = this.password.value;

      //Si el formulario no tiene errores, intentamos loguearnos.
      this.authService.login(this.loginUser).subscribe({
        //complete: () => {},
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.log(error.error);
          const headerInfo: HeaderMenuDTO = {
            showNavigationMenu: false,
          };
          this.headerMenusService.headerManagement.next(headerInfo);

          this.sharedService.sendMessage({
            message: 'Credenciales inválidas. Revisa el correo y la contraseña',
            type: 2,
          });
        },
        //El logueo ha sido un éxito, guardamos el token en disco y los datos del usuario en una clase global.
        next: (result) => {
          localStorage.setItem('token', result.access_token);
          const headerInfo: HeaderMenuDTO = { showNavigationMenu: true };
          this.headerMenusService.headerManagement.next(headerInfo);

          //Obtenemos los datos del usuario.
          const headers = new HttpHeaders({
            Authorization: `Bearer ${result.access_token}`,
          });

          this.userService.getLoggedUserData(headers).subscribe({
            //complete: () => {},
            error: (error: HttpErrorResponse) => {
              this.loading = false;
              console.log(error.error);
            },
            next: (user: UserDTO) => {
              this.loading = false;
              this.loggedUser.id = user.id;
              this.loggedUser.nombre = user.nombre;
              this.loggedUser.apellidos = user.apellidos;
              this.loggedUser.email = user.email;
              this.loggedUser.foto = user.foto;
              this.loggedUser.perfil = user.perfil;
              this.loggedUser.remember = this.rememberCheck.value;
            },
          });
          this.router.navigateByUrl('newsList');
        },
      });
    }
  }
}
