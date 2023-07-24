import { PedidosEntity } from "../../store/pedidosStore";
import { ESTADOS } from "../../types/estado";
import { fCurrency } from "../../utils/formatNumber";
import { fDate } from "../../utils/formatTime";

export const getCliente = (pedido: PedidosEntity) => [
  { label: "Nombre", value: pedido?.cliente?.nombre },
  { label: "Apellido", value: pedido?.cliente?.apellido },
  { label: "DNI", value: pedido?.cliente?.dni },
  { label: "Sexo", value: pedido?.cliente?.sexo },
];

export const getDetalle = (pedido: PedidosEntity) => [
  { label: "Vendedor", value: pedido?.creadoPor?.name },
  {
    label: "Comercializadora",
    value: pedido?.creadoPor?.comercializadora?.name,
    alternativeText: "Sin comercializadora",
  },
  { label: "Tipo de entidad", value: pedido?.entidad?.tipo },
  { label: "Nombre de entidad", value: pedido?.entidad?.nombre },
  { label: "Tipo de consulta", value: pedido?.tipoConsulta?.nombre },
  {
    label: "Monto solicitado",
    value: fCurrency(pedido?.montoSolicitado),
  },
  {
    label: "Comentario vendedor",
    value: pedido?.comentarioVendedor,
    alternativeText: "Sin comentario",
  },
  {
    label: "Fecha",
    value: `${pedido?.createdAt ? fDate(pedido?.createdAt) : "-"}`,
  },
];

const getAutorizadorFields = (pedido: PedidosEntity) =>
  pedido?.estado?.estado === ESTADOS.APROBADO
    ? [
        {
          label: "Monto autorizado",
          value: fCurrency(pedido?.estado?.montoAutorizado as string),
        },
        {
          label: "Monto cuota",
          value: fCurrency(pedido?.estado?.montoCuota as string),
        },
        { label: "Cantidad cuotas", value: pedido?.estado?.cantidadCuotas },
      ]
    : [];

export const getAutorizador = (pedido: PedidosEntity) => [
  { label: "Nombre", value: pedido?.estado?.autorizador?.name },
  ...getAutorizadorFields(pedido),
  {
    label: "Comentario autorizador",
    value: pedido?.estado?.comentario,
    alternativeText: "Sin comentario",
  },
];

export const getComision = (pedido: PedidosEntity) => [
  { label: "Estado", value: pedido?.comision?.estado },
  {
    label: "Monto",
    value: fCurrency(pedido!.comision!.monto),
  },
  {
    label: "Porcentaje",
    value: `${pedido?.comision?.porcentaje} %`,
  },
  {
    label: "Fecha de cobro",
    value: `${
      pedido?.comision?.cobradoAt ? fDate(pedido?.comision?.cobradoAt) : "-"
    }`,
  },
];
