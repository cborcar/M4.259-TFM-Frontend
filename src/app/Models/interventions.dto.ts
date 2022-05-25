export class InterventionDTO {
  id!: string;
  detalle: string;
  cambio_estado: string;
  created_at: Date;
  id_usuario: string;
  id_solicitud: string;

  constructor(
    detalle: string,
    cambio_estado: string,
    created_at: Date,
    id_usuario: string,
    id_solicitud: string
  ) {
    this.detalle = detalle;
    this.cambio_estado = cambio_estado;
    this.created_at = created_at;
    this.id_usuario = id_usuario;
    this.id_solicitud = id_solicitud;
  }
}
