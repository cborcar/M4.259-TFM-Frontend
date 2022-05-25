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
import { UserDTO } from 'src/app/Models/user.dto';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  user: UserDTO;
  nombre: FormControl;
  apellidos: FormControl;
  email: FormControl;
  password: FormControl;
  password_confirmation: FormControl;
  foto: FormControl;
  perfil: FormControl;
  userForm: FormGroup;
  pressedSave: boolean;
  isUpdateMode: boolean;
  isAdministrator: boolean;
  passPlaceholder: string;
  profileImage!: File;

  public loading: boolean = false;
  private userId: string | null;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loggedUser: LoggedUserData,
    private sharedService: SharedService,
    private userService: UserService
  ) {
    this.userId = this.activatedRoute.snapshot.paramMap.get('id');
    this.user = new UserDTO('', '', '', '', '');
    this.pressedSave = false;
    this.isUpdateMode = false;
    this.isAdministrator = false;
    this.passPlaceholder = '';

    this.nombre = new FormControl(this.user.nombre, [
      Validators.required,
      Validators.maxLength(60),
    ]);

    this.apellidos = new FormControl(this.user.apellidos, [
      Validators.required,
    ]);

    this.email = new FormControl(this.user.email, [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
    ]);

    //update
    if (this.userId) {
      this.password = new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(16),
      ]);

      this.password_confirmation = new FormControl('', [
        Validators.minLength(8),
        Validators.maxLength(16),
      ]);
    }
    //new
    else {
      this.password = new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ]);

      this.password_confirmation = new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ]);
    }

    this.foto = new FormControl('');
    this.perfil = new FormControl('', [Validators.required]);

    this.userForm = this.formBuilder.group({
      nombre: this.nombre,
      apellidos: this.apellidos,
      email: this.email,
      password: this.password,
      password_confirmation: this.password,
      foto: this.foto,
      perfil: this.perfil,
    });
  }

  ngOnInit(): void {
    // update
    if (this.userId) {
      this.loading = true;
      this.passPlaceholder = '(Déjala en blanco para no cambiarla)';
      this.isUpdateMode = true;

      this.userService.getUserById(this.userId).subscribe({
        //complete: () => {},
        error: (error: HttpErrorResponse) => {
          this.loading = false;
          console.log(error.error);
        },
        next: (user: UserDTO) => {
          this.loading = false;
          this.user = user;

          this.nombre.setValue(this.user.nombre);
          this.apellidos.setValue(this.user.apellidos);
          this.email.setValue(this.user.email);
          this.perfil.setValue(this.user.perfil);

          this.userForm = this.formBuilder.group({
            nombre: this.nombre,
            apellidos: this.apellidos,
            email: this.email,
            password: this.password,
            foto: this.foto,
            perfil: this.perfil,
          });
        },
      });
    }
    //create new
    else {
      this.perfil.setValue('Profesor');
    }
    if (this.loggedUser.perfil == 'Administrador') {
      this.isAdministrator = true;
    }
  }

  saveUser(): void {
    this.pressedSave = true;

    if (this.userForm.valid) {
      if (this.password.value != this.password_confirmation.value) {
        this.sharedService.sendMessage({
          message: 'Las contraseñas no coinciden',
          type: 2,
        });
      } else {
        this.user = this.userForm.value;
        if (this.isUpdateMode) {
          this.editUser();
        } else {
          this.createUser();
        }
      }
    }
  }

  private createUser(): void {
    let responseOK: boolean = false;
    this.userService.createUser(this.user).subscribe({
      complete: () => {
        if (responseOK) {
          this.sharedService.sendMessage({
            message: 'Usuario creado con éxito',
            type: 1,
          });
          this.router.navigateByUrl('userList');
        }
      },
      error: (error: HttpErrorResponse) => {
        console.log(error.error);
        this.sharedService.sendMessage({
          message: 'Ha habido un error al crear el usuario',
          type: 2,
        });
      },
      next: () => {
        responseOK = true;
      },
    });
  }

  private editUser(): void {
    let responseOK: boolean = false;

    if (this.userId) {
      this.userService.updateUser(this.userId, this.user).subscribe({
        complete: () => {
          if (responseOK) {
            this.sharedService.sendMessage({
              message: 'Usuario editado con éxito',
              type: 1,
            });

            if (this.userId == this.loggedUser.id) {
              this.updateLoggedUserData();
            }

            this.router.navigateByUrl('profile');
          }
        },
        error: (error: HttpErrorResponse) => {
          console.log(error.error);
          this.sharedService.sendMessage({
            message: 'Ha habido un error al editar el usuario',
            type: 2,
          });
        },
        next: () => {
          responseOK = true;
          if (this.profileImage != undefined && this.userId) {
            this.updateUserImage(this.userId);
          }
        },
      });
    }
  }

  uploadImage(event: any) {
    this.profileImage = event.target.files[0];
  }

  private updateUserImage(userId: string) {
    this.userService.updateUserImage(userId, this.profileImage).subscribe({
      error: (error: HttpErrorResponse) => {
        console.log(error.error);
        this.sharedService.sendMessage({
          message: 'Ha habido un error al registrar la imagen de usuario',
          type: 2,
        });
      },
      next: (response: any) => {
        if (this.userId == this.loggedUser.id) {
          this.loggedUser.foto = response;
        }
      },
    });
  }

  private updateLoggedUserData(): void {
    this.loggedUser.nombre = this.user.nombre;
    this.loggedUser.apellidos = this.user.apellidos;
    this.loggedUser.perfil = this.user.perfil;
    this.loggedUser.email = this.user.email;
  }
}
