export interface Pedido {
  id: number;
  clienteId: number;
  entidadId: number;
  creadoPorId: number;
  numeroTramite: string;
  estado: string;
  autorizadoPorId?: Date;
  autorizadoAt?: Date;
  tipoConsultaId: number;
  monto: number;
  cantidadCuotas?: number;
  montoCuota?: number;
  comentarioAutorizador?: string;
  comentarioVendedor: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  sexo: string;
  permitirNuevoPedido: boolean;
  createdAt: Date;
  pedidos: Pedido[];
}
