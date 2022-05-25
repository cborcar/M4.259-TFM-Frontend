export class NewsDTO {
  id!: string;
  titulo: string;
  descripcion: string;
  created_at: Date;
  id_usuario: string;

  constructor(
    titulo: string,
    descripcion: string,
    created_at: Date,
    id_usuario: string
  ) {
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.created_at = created_at;
    this.id_usuario = id_usuario;
  }
}
