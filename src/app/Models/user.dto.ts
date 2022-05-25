export class UserDTO {
  id!: string;
  nombre: string;
  apellidos: string;
  email: string;
  password!: string;
  foto: string;
  perfil: string;

  constructor(
    nombre: string,
    apellidos: string,
    email: string,
    foto: string,
    perfil: string
  ) {
    this.nombre = nombre;
    this.apellidos = apellidos;
    this.email = email;
    this.foto = foto;
    this.perfil = perfil;
  }
}
