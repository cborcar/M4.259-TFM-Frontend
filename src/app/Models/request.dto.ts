export class RequestDTO {
  id!: string;
  detalle: string;
  estado: string;
  tipo: string;
  created_at: Date;
  id_usuario: string;

  constructor(
    detalle: string,
    estado: string,
    tipo: string,
    created_at: Date,
    id_usuario: string
  ) {
    this.detalle = detalle;
    this.estado = estado;
    this.tipo = tipo;
    this.created_at = created_at;
    this.id_usuario = id_usuario;
  }
}
