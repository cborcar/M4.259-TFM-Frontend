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

//La ruta donde se encuentra la APIasdfasdfasdf12
export const API_URL: string = 'http://localhost:8000/'; //Ruta local
//export const API_URL: string = '/public/'; //Ruta servidor

//La ruta donde se almacenan las imágenes de los perfiles de usuario
export const STORAGE_URL: string = ''; //Ruta local
//export const STORAGE_URL: string = '../../storage/app/public/userImages/'; //Ruta servidor
