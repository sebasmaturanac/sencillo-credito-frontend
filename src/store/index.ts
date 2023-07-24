import create, { SetState, GetState } from "zustand";
import { StoreApiWithSubscribeWithSelector } from "zustand/middleware";
import { Cliente } from "../pages/home/homeTypes";
import { http } from "../utils/api";

interface TipoConsuta {
  id: number;
  nombre: string;
}

export interface Entidades {
  id: number;
  tipo: string;
  nombre: string;
}

type SencilloState = {
  tipoConsultas: TipoConsuta[];
  entidades: Entidades[];
  cliente: Cliente | null;
  fetchEntidades: () => void;
  fetchConsultas: () => void;
  setCliente: (cliente: Cliente) => void;
};

export const useStore = create<
  SencilloState,
  SetState<SencilloState>,
  GetState<SencilloState>,
  StoreApiWithSubscribeWithSelector<SencilloState>
>((set) => ({
  tipoConsultas: [],
  entidades: [],
  cliente: null,
  setCliente: async (cliente: Cliente) => {
    set({ cliente });
  },
  fetchEntidades: async () => {
    const { data } = await http.get("/providers/entidades");
    const entidades: Entidades[] = data.respuesta;
    set({ entidades });
  },
  fetchConsultas: async () => {
    const { data } = await http.get("/providers/tipoConsulta");
    const tipoConsultas: TipoConsuta[] = data.respuesta;
    set({ tipoConsultas });
  },
}));
