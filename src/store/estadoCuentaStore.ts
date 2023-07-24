import create, { SetState, GetState } from "zustand";
import { http } from "../utils/api";
import { StoreApiWithSubscribeWithSelector } from "zustand/middleware";

type EstadoCuentaState = {
  loading: boolean;
  stringSearch: string;
  currentPage: number;
  pageSize: number;
  toDate: string;
  fromDate: string;
  cuentas: EstadoCuentaEntity[];
  totalPedidos: number;
  estado: string;
  totalCobrar: number;
  getEstadoCuenta: () => void;
  resetPage: () => void;
  toggleLoading: () => void;
  setStringSearch: (stringSearch: string) => void;
  setEstado: (estado: string) => void;
  setFiltroFecha: (fechas: { toDate: string; fromDate: string }) => void;
  setFiltros: (
    fechas: { toDate: string; fromDate: string },
    estado: string
  ) => void;
  clearFiltros: () => void;
  setPageSize: (event: any) => void;
  nextPage: () => void;
  resetStore: () => void;
};

export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  sexo: string;
}

export interface Entidad {
  id: number;
  tipo: string;
  nombre: string;
  deleted: boolean;
  deletedAt?: any;
}

export interface Comercializadora {
  name: string;
}

export interface CreadoPor {
  comercializadora: Comercializadora;
  name: string;
}

export interface TipoConsulta {
  id: number;
  nombre: string;
  deleted: boolean;
}

export interface Autorizador {
  id: number;
  name: string;
}

export interface Estado {
  estado: string;
  montoAutorizado: string;
  cantidadCuotas: number;
  montoCuota: string;
  comentario: string;
  fecha?: string | null;
  autorizador: Autorizador;
}

export interface Pedido {
  id: number;
  montoSolicitado: string;
  comentarioVendedor: string;
  numeroPedido: string;
  cliente: Cliente;
  entidad: Entidad;
  creadoPor: CreadoPor;
  tipoConsulta: TipoConsulta;
  estado: Estado;
  cobradoAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EstadoCuentaEntity {
  id: number;
  monto: string;
  porcentaje: string;
  estado: string;
  cobradoAt?: string | null | undefined;
  pedidoId: number;
  createdAt: string;
  updatedAt: string | null | undefined;
  pedido: Pedido;
}

const initialState = {
  loading: false,
  stringSearch: "",
  currentPage: 0,
  pageSize: 10,
  toDate: "",
  fromDate: "",
  cuentas: [],
  totalPedidos: 0,
  totalCobrar: 0,
  estado: "",
};

export const useEstadoCuentaStore = create<
  EstadoCuentaState,
  SetState<EstadoCuentaState>,
  GetState<EstadoCuentaState>,
  StoreApiWithSubscribeWithSelector<EstadoCuentaState>
>((set: SetState<EstadoCuentaState>, get: GetState<EstadoCuentaState>) => ({
  ...initialState,
  resetStore: () => set(() => initialState),
  toggleLoading: () =>
    set((state: EstadoCuentaState) => ({ loading: !state.loading })),
  nextPage: () => {
    set({ currentPage: get().currentPage + 1 });
    get().getEstadoCuenta();
  },
  resetPage: () => {
    set({ currentPage: 0 });
    get().getEstadoCuenta();
  },
  clearFiltros: () => {
    set({ currentPage: 0, toDate: "", fromDate: "", estado: "" });
    get().getEstadoCuenta();
  },
  setPageSize: (event: any) => {
    set({ pageSize: event?.target?.value || 10, currentPage: 0 });
    get().getEstadoCuenta();
  },
  setStringSearch: (stringSearch: string) => {
    if (stringSearch.length === 0 || stringSearch.length > 2) {
      set({ stringSearch, currentPage: 0 });
      get().getEstadoCuenta();
    }
  },
  setEstado: (estado: string) => {
    set({ estado, currentPage: 0 });
    get().getEstadoCuenta();
  },
  setFiltroFecha: (fechas: { toDate: string; fromDate: string }) => {
    set({ ...fechas, currentPage: 0 });
    get().getEstadoCuenta();
  },
  setFiltros: (
    fechas: { toDate: string; fromDate: string },
    estado: string
  ) => {
    set({ ...fechas, estado, currentPage: 0 });
    get().getEstadoCuenta();
  },
  getEstadoCuenta: async () => {
    try {
      get().toggleLoading();
      const { data } = await http.get("/pedido/estadoCuenta", {
        params: {
          string: get().stringSearch,
          page: get().currentPage + 1,
          take: get().pageSize,
          toDate: get().toDate,
          fromDate: get().fromDate,
          estado: get().estado,
        },
      });
      const { respuesta } = data;
      const cuentas = get().currentPage
        ? [...get().cuentas, ...respuesta[0]?.estadoCuenta]
        : respuesta[0]?.estadoCuenta;
      set({
        cuentas,
        totalPedidos: respuesta[0].total,
        totalCobrar: respuesta[0].totalCobrar,
      });
    } catch (error) {
      console.error("error: ", error);
    } finally {
      get().toggleLoading();
    }
  },
}));

export const estadoCuentaStoreSelector = (state: EstadoCuentaState) => ({
  loading: state.loading,
  cuentas: state.cuentas,
  currentPage: state.currentPage,
  pageSize: state.pageSize,
  totalPedidos: state.totalPedidos,
  totalCobrar: state.totalCobrar,
  estado: state.estado,
  getEstadoCuenta: state.getEstadoCuenta,
  resetPage: state.resetPage,
  clearFiltros: state.clearFiltros,
  toggleLoading: state.toggleLoading,
  setStringSearch: state.setStringSearch,
  setEstado: state.setEstado,
  setFiltroFecha: state.setFiltroFecha,
  setFiltros: state.setFiltros,
  setPageSize: state.setPageSize,
  nextPage: state.nextPage,
  resetStore: state.resetStore,
});
