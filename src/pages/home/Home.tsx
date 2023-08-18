import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonProgressBar,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import shallow from "zustand/shallow";
import { add } from "ionicons/icons";
import { useEffect, useState } from "react";
//@ts-ignore
import LetteredAvatar from "react-lettered-avatar";
import { useStore } from "../../store";
import {
  PedidosEntity,
  pedidoStoreSelector,
  usePedidoStore,
} from "../../store/pedidosStore";
import { useOneSignal } from "../../utils/oneSignal";
import { fDate } from "../../utils/formatTime";
import { AVATAR_COLORS, AVATAR_LETTERS, ESTADOS } from "../../types/estado";
import ProductDetail from "../../components/productDetail/ProductDetail";
import Filters from "../../components/filters/Filters";
import { chevronDownCircleOutline, imagesOutline } from "ionicons/icons";
import UploadPictureModal from "../../components/uploadPictureModal/UploadPictureModal";
//import { subscribeToChats } from "../../socket/socket";
//import { http } from "../../utils/api";

const Home: React.FC = ({ history }: any) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [pedidoSelected, setPedidoSelected] = useState<PedidosEntity>();
  const fetchEntidades = useStore((state) => state.fetchEntidades);
  const fetchConsultas = useStore((state) => state.fetchConsultas);
  const [present] = useIonToast();
  const { loading, pedidosTable, currentPage, getPedidos, nextPage } =
    usePedidoStore(pedidoStoreSelector, shallow);
  useOneSignal();

  useEffect(() => {
    //subscribeToChats(getChats())
    try {
      fetchEntidades();
      fetchConsultas();
      getPedidos();
    } catch (error: any) {
      present({
        message: error?.response?.data?.mensaje,
        color: "danger",
        duration: 3000,
      });
    }
  }, [fetchEntidades, fetchConsultas, getPedidos, present]);

  /*const getChats = async () => {
    try {
        const response = await http.get("/chat/messages");
        console.log('chats sokcet', response)
    } catch (error) {
        console.log('chats error ')
    } finally {
        console.log('chats ok')
    }
};*/

  const toggleModal = () => setIsModalOpen((state) => !state);

  const toggleUploadPhotoModal = () => setIsUploadModalOpen((state) => !state);

  const pushToCliente = () => history.push("/agregarCliente");

  const handleVerPedido = (pedido: PedidosEntity) => () => {
    setPedidoSelected(pedido);
    setIsModalOpen(true);
  };

  const doRefresh = async (event: any) => {
    try {
      await getPedidos();
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

  const handleUploadPhoto =
    (pedido: PedidosEntity) => (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
      setPedidoSelected(pedido);
      toggleUploadPhotoModal();
    };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Bienvenido</IonTitle>
          <Filters />
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
            <IonTitle size="large">Bienvenido</IonTitle>
          </IonToolbar>
        </IonHeader>
        {loading && currentPage === 0 ? (
          <IonProgressBar type="indeterminate" />
        ) : (
          <>
            <IonList>
              <IonListHeader>
                <IonLabel>Pedidos</IonLabel>
              </IonListHeader>

              {pedidosTable.length > 0 ? (
                pedidosTable.map((pedido: PedidosEntity, i) => (
                  <IonItem
                    button
                    key={`${pedido.cliente.id}-${i}`}
                    onClick={handleVerPedido(pedido)}
                  >
                    <IonAvatar slot="start">
                      <LetteredAvatar
                        name={AVATAR_LETTERS[pedido.estado.estado]}
                        backgroundColor={AVATAR_COLORS[pedido.estado.estado]}
                        radius={0}
                        style={{ fontSize: 18 }}
                      />
                    </IonAvatar>
                    <IonLabel>
                      <h2>
                        {pedido.cliente.apellido} {pedido.cliente.nombre}
                      </h2>
                      <p>DNI: {pedido.cliente.dni}</p>
                      <p>{fDate(pedido.createdAt)}</p>
                    </IonLabel>
                    {(pedido.estado.estado === ESTADOS.PENDIENTE ||
                      pedido.estado.estado === ESTADOS.PENDIENTE_DE_MARGEN) && (
                      <IonButton
                        slot="end"
                        fill="clear"
                        onClick={handleUploadPhoto(pedido)}
                      >
                        <IonIcon icon={imagesOutline} slot="icon-only" />
                      </IonButton>
                    )}
                  </IonItem>
                ))
              ) : (
                <IonTitle size="small">No hay pedidos para mostrar</IonTitle>
              )}
            </IonList>
            <IonFab
              vertical="bottom"
              horizontal="end"
              slot="fixed"
              onClick={pushToCliente}
            >
              <IonFabButton>
                <IonIcon icon={add} />
              </IonFabButton>
            </IonFab>
            <ProductDetail
              isOpen={isModalOpen}
              toggleModal={toggleModal}
              pedido={pedidoSelected}
            />
            <UploadPictureModal
              isOpen={isUploadModalOpen}
              toggleModal={toggleUploadPhotoModal}
              pedido={pedidoSelected}
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

export default Home;
