import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonButton,
  IonCardContent,
  useIonToast,
  IonLoading,
  IonIcon,
} from "@ionic/react";
import { Camera, CameraResultType } from "@capacitor/camera";
import { useState } from "react";
import { http } from "../../utils/api";
import { trashBin } from "ionicons/icons";

const PictureUploader = ({ pedidoId }: any) => {
  const [loading, setLoading] = useState(false);
  const [presentToast] = useIonToast();
  const [photosInBase64, setPhotosInBase64] = useState<
    { base64: string; url: string }[]
  >([]);

  const takePicture = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      height: 1080,
      promptLabelPhoto: "Galeria",
      promptLabelPicture: "Tomar foto",
      promptLabelHeader: "Importar foto desde:",
      promptLabelCancel: "Cancelar",
    });
    onSubmitFoto(image.base64String as string);
  };

  const onSubmitFoto = async (base64: string) => {
    try {
      setLoading(true);
      const bodyFormData = new FormData();
      bodyFormData.append("pedidoId", pedidoId);
      bodyFormData.append("file", base64);
      const { data }: any = await http.post("/uploads/file", bodyFormData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPhotosInBase64([
        ...photosInBase64,
        { url: data.respuesta[0].url, base64 },
      ]);
      presentToast({
        message: data.mensaje,
        duration: 3000,
      });
    } catch (error: any) {
      presentToast({
        message: error?.response?.data?.mensaje
          ? error?.response?.data?.mensaje
          : "Problemas de conexión con el servidor. Pongase en contacto con algún representante",
        color: "danger",
        position: "middle",
        buttons: [
          {
            text: "Aceptar",
            role: "cancel",
            handler: () => {},
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const onDeletePhoto = async (url: string) => {
    try {
      setLoading(true);
      const { data }: any = await http.delete(`/uploads/file/${url}`);
      const filteredPhotos = photosInBase64.filter(
        (photo) => photo.url !== url
      );
      setPhotosInBase64(filteredPhotos);
      presentToast({
        message: data.mensaje,
        duration: 3000,
      });
    } catch (error: any) {
      presentToast({
        message: error?.response?.data?.mensaje
          ? error?.response?.data?.mensaje
          : "Problemas de conexión con el servidor. Pongase en contacto con algún representante",
        color: "danger",
        position: "middle",
        buttons: [
          {
            text: "Aceptar",
            role: "cancel",
            handler: () => {},
          },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle></IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonButton
          expand="block"
          disabled={photosInBase64.length >= 15 || loading}
          onClick={takePicture}
        >
          Agregar foto
        </IonButton>
        <IonLoading
          isOpen={loading}
          message={"Procesando... Espere por favor"}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {photosInBase64.map((photo) => (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              key={photo.url}
            >
              <IonImg
                src={"data:image/jpeg;base64," + photo.base64}
                style={{
                  width: "200px",
                  maxHeight: "300px",
                  marginTop: "10px",
                  marginBottom: "10px",
                  marginRight: "10px",
                }}
              />
              <IonIcon
                icon={trashBin}
                size="large"
                color="danger"
                onClick={() => onDeletePhoto(photo.url)}
              />
            </div>
          ))}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default PictureUploader;
