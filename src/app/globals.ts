import { Injectable } from '@angular/core';

@Injectable()
export class LoggedUserData {
  id: string = '';
  nombre: string = '';
  apellidos: string = '';
  email: string = '';
  foto: string = '';
  perfil: string = '';
  remember: boolean = false;
}
