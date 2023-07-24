import { ROLE } from "../types/role";

export const isAdmin = () => {
  const role = localStorage.getItem("role");
  return role === ROLE.AUTORIZADOR || role === ROLE.SUPERUSER;
};

export const isSuperUser = () => {
  const role = localStorage.getItem("role");
  return role === ROLE.SUPERUSER;
};

export const isComercializadora = () => {
  const role = localStorage.getItem("role");
  return role === ROLE.COMERCIALIZADORA;
};

export const isVendedor = () => {
  const role = localStorage.getItem("role");
  return role === ROLE.VENDEDOR;
};

export const isVendedorIndenpendiente = () => {
  const comercializadoraId = JSON.parse(
    localStorage.getItem("comercializadoraId")
  );
  return !comercializadoraId;
};

export const canViewComisiones = () => isAdmin() || isVendedorIndenpendiente();

export const canViewEstadoCuenta = () => {
  if (isAdmin()) return false;
  return isComercializadora() || isVendedorIndenpendiente();
};
