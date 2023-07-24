import create, { SetState, GetState } from "zustand";
import { http } from "../utils/api";
import { StoreApiWithSubscribeWithSelector } from "zustand/middleware";
import COMISION_ESTADO from "../types/comision";
import { ESTADOS } from "../types/estado";

type PedidoState = {
  loading: boolean;
  stringSearch: string;
  currentPage: number;
  pageSize: number;
  toDate: string;
  fromDate: string;
  pedidos: PedidosEntity[];
  totalPedidos: number;
  estado: string;
  getPedidos: () => void;
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
  handleRevisionUpdate: (pedidoToUpdate: PedidosEntity) => void;
  setPageSize: (event: any) => void;
  nextPage: () => void;
  updateEstadoDePagoPedido: (idPedido: number) => void;
  updateEstadoPedidoMargenOK: (idPedido: number) => void;
  resetStore: () => void;
};

export interface PedidosEntity {
  id: number;
  montoSolicitado: string;
  comentarioVendedor?: string | null;
  numeroPedido: string;
  cliente: Cliente;
  entidad: Entidad;
  creadoPor: CreadoPor;
  tipoConsulta: TipoConsulta;
  estado: Estado;
  createdAt: string;
  updatedAt: string;
  comision?: Comision | null;
}

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
  deletedAt?: null;
}

export interface CreadoPor {
  name: string;
  comercializadora?: {
    name?: string;
  };
}

export interface TipoConsulta {
  id: number;
  nombre: string;
  deleted: boolean;
}

export interface Estado {
  estado: string;
  montoAutorizado?: string | null;
  cantidadCuotas?: number | null;
  montoCuota?: string | null;
  comentario?: string | null;
  fecha?: string | null;
  autorizador?: {
    name?: string;
    id: number;
  };
}

export interface Comision {
  id: number;
  monto: string;
  porcentaje: string;
  estado: string;
  cobradoAt?: string | null;
  createdAt: string;
}

const initialState = {
  loading: false,
  stringSearch: "",
  currentPage: 0,
  pageSize: 10,
  toDate: "",
  fromDate: "",
  pedidos: [],
  totalPedidos: 0,
  estado: "",
};

export const usePedidoStore = create<
  PedidoState,
  SetState<PedidoState>,
  GetState<PedidoState>,
  StoreApiWithSubscribeWithSelector<PedidoState>
>((set: SetState<PedidoState>, get: GetState<PedidoState>) => ({
  ...initialState,
  resetStore: () => set(() => initialState),
  toggleLoading: () =>
    set((state: PedidoState) => ({ loading: !state.loading })),
  nextPage: () => {
    set({ currentPage: get().currentPage + 1 });
    get().getPedidos();
  },
  resetPage: () => {
    set({ currentPage: 0 });
    get().getPedidos();
  },
  clearFiltros: () => {
    set({ currentPage: 0, toDate: "", fromDate: "", estado: "" });
    get().getPedidos();
  },
  setPageSize: (event: any) => {
    set({ pageSize: event?.target?.value || 10, currentPage: 0 });
    get().getPedidos();
  },
  setStringSearch: (stringSearch: string) => {
    if (stringSearch.length === 0 || stringSearch.length > 2) {
      set({ stringSearch, currentPage: 0 });
      get().getPedidos();
    }
  },
  setEstado: (estado: string) => {
    set({ estado, currentPage: 0 });
    get().getPedidos();
  },
  setFiltroFecha: (fechas: { toDate: string; fromDate: string }) => {
    set({ ...fechas, currentPage: 0 });
    get().getPedidos();
  },
  setFiltros: (
    fechas: { toDate: string; fromDate: string },
    estado: string
  ) => {
    set({ ...fechas, estado, currentPage: 0 });
    get().getPedidos();
  },
  handleRevisionUpdate: (pedidoToUpdate: PedidosEntity) => {
    set((state: PedidoState) => {
      const copyTable = state.pedidos.map((pedido) => ({ ...pedido }));
      const pedido = copyTable.find(({ id }) => id === pedidoToUpdate.id);
      if (!pedido) return state;
      pedido.estado = { ...pedidoToUpdate.estado };
      return { pedidos: copyTable };
    });
  },
  updateEstadoDePagoPedido: (idPedido: number) => {
    set((state: PedidoState) => {
      const pedidos = state.pedidos.map((pedido) => ({ ...pedido }));
      const pedidoToUpdate = pedidos.find((pedido) => pedido.id === idPedido);
      pedidoToUpdate!.comision!.estado = COMISION_ESTADO.COBRADO;
      return { pedidos };
    });
  },
  updateEstadoPedidoMargenOK: (idPedido: number) => {
    set((state: PedidoState) => {
      const pedidos = state.pedidos.map((pedido) => ({ ...pedido }));
      const pedidoToUpdate = pedidos.find((pedido) => pedido.id === idPedido);
      pedidoToUpdate!.estado.estado = ESTADOS.PENDIENTE_DE_MARGEN_OK;
      return { pedidos };
    });
  },
  getPedidos: async () => {
    try {
      get().toggleLoading();
      const { data } = await http.get("/pedido/search", {
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
      const pedidos = get().currentPage
        ? [...get().pedidos, ...respuesta[0]?.pedidos]
        : respuesta[0]?.pedidos;
      set({
        pedidos,
        totalPedidos: respuesta[0].total,
      });
    } catch (error) {
      console.error("error: ", error);
    } finally {
      get().toggleLoading();
    }
  },
}));

export const pedidoStoreSelector = (state: PedidoState) => ({
  loading: state.loading,
  pedidosTable: state.pedidos,
  currentPage: state.currentPage,
  pageSize: state.pageSize,
  totalPedidos: state.totalPedidos,
  estado: state.estado,
  getPedidos: state.getPedidos,
  resetPage: state.resetPage,
  clearFiltros: state.clearFiltros,
  toggleLoading: state.toggleLoading,
  setStringSearch: state.setStringSearch,
  setEstado: state.setEstado,
  setFiltroFecha: state.setFiltroFecha,
  setFiltros: state.setFiltros,
  handleRevisionUpdate: state.handleRevisionUpdate,
  setPageSize: state.setPageSize,
  nextPage: state.nextPage,
  updateEstadoDePagoPedido: state.updateEstadoDePagoPedido,
  updateEstadoPedidoMargenOK: state.updateEstadoPedidoMargenOK,
  resetStore: state.resetStore,
});
