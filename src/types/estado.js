export const ESTADOS = {
  APROBADO: "APROBADO",
  RECHAZADO: "RECHAZADO",
  PENDIENTE: "PENDIENTE",
  PENDIENTE_DE_MARGEN: "PENDIENTE_DE_MARGEN",
  PENDIENTE_DE_MARGEN_OK: "PENDIENTE_DE_MARGEN_OK",
};

export const ESTADOS_LABEL = {
  [ESTADOS.APROBADO]: "Aprobado",
  [ESTADOS.RECHAZADO]: "Rechazado",
  [ESTADOS.PENDIENTE]: "Pendiente",
  [ESTADOS.PENDIENTE_DE_MARGEN]: "Pendiente de margen",
  [ESTADOS.PENDIENTE_DE_MARGEN_OK]: "Pendiente de margen listo",
};

export const ESTADOS_LABEL_ALERT = {
  [ESTADOS.APROBADO]: "Aprobado",
  [ESTADOS.RECHAZADO]: "Rechazado",
  [ESTADOS.PENDIENTE]: "Poner en revisión para aprobar o rechazar",
};

export const ESTADO_COLOR = {
  [ESTADOS.APROBADO]: "success",
  [ESTADOS.RECHAZADO]: "error",
  [ESTADOS.PENDIENTE]: "warning",
  [ESTADOS.PENDIENTE_DE_MARGEN]: "info",
};

export const ESTADOS_LIST = Object.keys(ESTADOS);

export const ESTADOS_DROPDOWN = [
  { value: "", label: "Todos los estados" },
  { value: ESTADOS.PENDIENTE, label: "Pendiente" },
  { value: ESTADOS.APROBADO, label: "Aprobado" },
  { value: ESTADOS.RECHAZADO, label: "Rechazado" },
  { value: ESTADOS.PENDIENTE_DE_MARGEN, label: "Pediente de margen" },
  { value: ESTADOS.PENDIENTE_DE_MARGEN_OK, label: "Pediente de margen listo" },
];

export const AVATAR_LETTERS = {
  [ESTADOS.APROBADO]: "A P",
  [ESTADOS.RECHAZADO]: "R E",
  [ESTADOS.PENDIENTE]: "P",
  [ESTADOS.PENDIENTE_DE_MARGEN]: "P M",
  [ESTADOS.PENDIENTE_DE_MARGEN_OK]: "P M L",
};

export const AVATAR_COLORS = {
  [ESTADOS.APROBADO]: "green",
  [ESTADOS.RECHAZADO]: "red",
  [ESTADOS.PENDIENTE_DE_MARGEN]: "lightblue",
  [ESTADOS.PENDIENTE]: "orange",
};
