const COMISION_ESTADO = {
  COBRADO: "COBRADO",
  NO_COBRADO: "NO_COBRADO",
};

export const COMISION_ESTADO_COLOR = {
  [COMISION_ESTADO.COBRADO]: "success",
  [COMISION_ESTADO.NO_COBRADO]: "warning",
};

export const COMISION_ESTADOS_DROPDOWN = [
  { value: "", label: "Todos los estados" },
  { value: COMISION_ESTADO.COBRADO, label: "Cobrado" },
  { value: COMISION_ESTADO.NO_COBRADO, label: "No cobrado" },
];

export const AVATAR_LETTERS_ESTADO_CUENTA = {
  [COMISION_ESTADO.COBRADO]: "C O",
  [COMISION_ESTADO.NO_COBRADO]: "N C",
};

export const AVATAR_COLORS_ESTADO_CUENTA = {
  [COMISION_ESTADO.COBRADO]: "green",
  [COMISION_ESTADO.NO_COBRADO]: "orange",
};

export default COMISION_ESTADO;
