import {
  IonModal,
  IonContent,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonButton,
  useIonToast,
  IonCard,
  IonText,
  IonSpinner,
  useIonAlert,
} from "@ionic/react";
import { useEffect, useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import shallow from "zustand/shallow";
import PictureUploader from "../../pages/uploadPicturePedido/PictureUploader";
import {
  PedidosEntity,
  pedidoStoreSelector,
  usePedidoStore,
} from "../../store/pedidosStore";
import { ESTADOS } from "../../types/estado";
import { http } from "../../utils/api";

interface Props {
  isOpen: boolean;
  toggleModal: () => void;
  pedido: PedidosEntity | undefined;
}

const UploadPictureModal = ({ isOpen, toggleModal, pedido }: Props) => {
  const [photos, setPhotos] = useState([]);
  const [loadingPendienteMargen, setLoadingPendienteMargen] = useState(false);
  const [present] = useIonToast();
  const [presentAlert] = useIonAlert();
  const { updateEstadoPedidoMargenOK } = usePedidoStore(
    pedidoStoreSelector,
    shallow
  );

  useEffect(() => {
    const getPhotos = async () => {
      try {
        const {
          data: { respuesta },
        }: any = await http.get(`/pedido/attachment/${pedido?.id}`);
        const fotosMapped = respuesta.map((foto: any) => ({
          src: foto.url,
          alt: foto.url,
          downloadUrl: foto.url,
        }));
        setPhotos(fotosMapped);
      } catch (error: any) {
        present({
          message: error?.data?.mensaje,
          color: "danger",
          duration: 3000,
        });
      }
    };

    if (isOpen) {
      getPhotos();
    }
  }, [isOpen, pedido?.id, present]);

  const handleFinalizarPendienteMargen = async () => {
    try {
      setLoadingPendienteMargen(true);
      await http.post("/pedido/pendienteMargenOk", { pedidoId: pedido?.id });
      updateEstadoPedidoMargenOK(pedido!.id);
      toggleModal();
    } catch (error: any) {
      present({
        message: error?.data?.mensaje,
        color: "danger",
        duration: 3000,
      });
    } finally {
      setLoadingPendienteMargen(false);
    }
  };

  const handleFinalizar = () =>
    presentAlert({
      header: "Finalizar pedido",
      message:
        "¿Está seguro que desea dar por finalizado el pedido? No se podrán agregar mas imágenes.",
      buttons: [
        "Cancelar",
        { text: "Finalizar", handler: handleFinalizarPendienteMargen },
      ],
    });

  return (
    <IonModal isOpen={isOpen} backdropDismiss={false}>
      <IonToolbar>
        <IonButtons slot="end">
          <IonButton onClick={toggleModal}>Cerrar</IonButton>
        </IonButtons>
        <IonTitle>Subit foto</IonTitle>
      </IonToolbar>
      <IonContent>
        {pedido?.estado.estado === ESTADOS.PENDIENTE_DE_MARGEN &&
          (loadingPendienteMargen ? (
            <IonSpinner name="circular" />
          ) : (
            <IonButton
              fill="clear"
              size="small"
              expand="full"
              style={{ textDecoration: "underline" }}
              onClick={handleFinalizar}
            >
              Notificar finalización pendiente de margen
            </IonButton>
          ))}
        <PictureUploader pedidoId={pedido?.id} />
        {photos.length !== 0 ? (
          <PhotoProvider>
            {photos.map((photo: any) => (
              <PhotoView key={photo.src} src={photo.src}>
                <IonCard>
                  <img src={photo.src} alt="" />
                </IonCard>
              </PhotoView>
            ))}
          </PhotoProvider>
        ) : (
          <IonText style={{ margin: 16 }}>
            El pedido no posee fotos cargadas
          </IonText>
        )}
      </IonContent>
    </IonModal>
  );
};

export default UploadPictureModal;
