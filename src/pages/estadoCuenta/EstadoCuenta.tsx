import {
  IonAvatar,
  IonButtons,
  IonContent,
  IonHeader,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonNote,
  IonPage,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import shallow from "zustand/shallow";
import { useEffect, useState } from "react";
//@ts-ignore
import LetteredAvatar from "react-lettered-avatar";
import { useStore } from "../../store";
import { PedidosEntity } from "../../store/pedidosStore";
import { fDate } from "../../utils/formatTime";
import ProductDetail from "../../components/productDetail/ProductDetail";
import {
  useEstadoCuentaStore,
  estadoCuentaStoreSelector,
  EstadoCuentaEntity,
} from "../../store/estadoCuentaStore";
import {
  AVATAR_COLORS_ESTADO_CUENTA,
  AVATAR_LETTERS_ESTADO_CUENTA,
} from "../../types/comision";
import FiltersEstadoCuenta from "./FiltersEstadoCuenta";
import { fCurrency } from "../../utils/formatNumber";
import { chevronDownCircleOutline } from "ionicons/icons";

const EstadoCuenta: React.FC = ({ history }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pedidoSelected, setPedidoSelected] = useState<EstadoCuentaEntity>();
  const fetchEntidades = useStore((state) => state.fetchEntidades);
  const fetchConsultas = useStore((state) => state.fetchConsultas);
  const [present] = useIonToast();
  const {
    loading,
    cuentas,
    currentPage,
    totalCobrar,
    getEstadoCuenta,
    nextPage,
  } = useEstadoCuentaStore(estadoCuentaStoreSelector, shallow);

  useEffect(() => {
    try {
      getEstadoCuenta();
    } catch (error: any) {
      present({
        message: error?.response?.data?.mensaje,
        color: "danger",
        duration: 3000,
      });
    }
  }, [fetchEntidades, fetchConsultas, getEstadoCuenta, present]);

  const mapPedido = (cuenta: EstadoCuentaEntity): PedidosEntity => {
    return {
      ...cuenta?.pedido,
      comision: {
        ...cuenta,
      },
    };
  };

  const toggleModal = () => setIsModalOpen((state) => !state);

  const handleVerPedido = (cuenta: EstadoCuentaEntity) => () => {
    setPedidoSelected(cuenta);
    setIsModalOpen(true);
  };

  const doRefresh = async (event: any) => {
    try {
      await getEstadoCuenta();
      event.detail.complete();
      present({
        message: "Se actualizo correctamente",
        duration: 3000,
      });
    } catch (error: any) {
      present({
        message: error?.response?.data?.mensaje,
        color: "danger",
        duration: 3000,
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>
            Estado cuenta <br />
            <IonNote>Total a cobrar: {fCurrency(totalCobrar)}</IonNote>
          </IonTitle>
          <FiltersEstadoCuenta />
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={doRefresh}>
          <IonRefresherContent
            pullingIcon={chevronDownCircleOutline}
            pullingText="Tirar para recargar"
            refreshingSpinner="circles"
            refreshingText="Recargando..."
          ></IonRefresherContent>
        </IonRefresher>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Estado cuenta</IonTitle>
          </IonToolbar>
        </IonHeader>
        {loading && currentPage === 0 ? (
          <IonProgressBar type="indeterminate" />
        ) : (
          <>
            <IonList>
              {cuentas.length > 0 ? (
                cuentas.map((cuenta: EstadoCuentaEntity, i) => (
                  <IonItem
                    button
                    key={`${cuenta.id}-${i}`}
                    onClick={handleVerPedido(cuenta)}
                  >
                    <IonAvatar slot="start">
                      <LetteredAvatar
                        name={AVATAR_LETTERS_ESTADO_CUENTA[cuenta.estado]}
                        backgroundColor={
                          AVATAR_COLORS_ESTADO_CUENTA[cuenta.estado]
                        }
                      />
                    </IonAvatar>
                    <IonLabel>
                      <h2>
                        {cuenta.pedido.cliente.apellido}{" "}
                        {cuenta.pedido.cliente.nombre}
                      </h2>
                      <p>Monto: ${cuenta.monto}</p>
                      <p>Fecha pedido: {fDate(cuenta.createdAt)}</p>
                      {cuenta.cobradoAt && (
                        <p>Fecha cobro: {fDate(cuenta.cobradoAt)}</p>
                      )}
                      <p>Porcentaje: {cuenta.porcentaje}%</p>
                    </IonLabel>
                  </IonItem>
                ))
              ) : (
                <IonTitle size="small">
                  No hay estados de cuenta para mostrar
                </IonTitle>
              )}
            </IonList>
            <ProductDetail
              isOpen={isModalOpen}
              toggleModal={toggleModal}
              pedido={mapPedido(pedidoSelected!)}
            />
          </>
        )}
        <IonInfiniteScroll
          onIonInfinite={nextPage}
          threshold="100px"
          disabled={loading}
        >
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more data..."
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
  );
};

export default EstadoCuenta;
