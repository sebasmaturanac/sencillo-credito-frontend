import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonTitle,
  IonContent,
  IonButton,
  useIonAlert,
} from "@ionic/react";
import { useHistory, useParams } from "react-router";
import PictureUploader from "./PictureUploader";

const UploadPicturePedido = () => {
  const history = useHistory();
  const [present] = useIonAlert();
  const { pedidoId }: any = useParams();

  const handleFinalizar = () =>
    present({
      header: "Finalizar pedido",
      message:
        "¿Está seguro que desea dar por finalizado el pedido? No se podrán agregar mas imágenes.",
      buttons: [
        "Cancelar",
        { text: "Finalizar", handler: () => history.replace("/home") },
      ],
    });

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Subir Imagenes</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleFinalizar}>Finalizar</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <PictureUploader pedidoId={pedidoId} />
      </IonContent>
    </IonPage>
  );
};

export default UploadPicturePedido;
