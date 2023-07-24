import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { http } from "../../utils/api";
import { useStore } from "../../store";
import { Cliente as ClienteType } from "../home/homeTypes";
import * as yup from "yup";

const schema = yup.object({
  nombre: yup.string().required("El nombre es requerido"),
  apellido: yup.string().required("La apellido es requerido"),
  sexo: yup.string().required("El sexo es requerida"),
  dni: yup.string().required("El DNI es requerido"),
});

const Cliente = ({ history }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [present] = useIonToast();
  const [dniClient, setDniClient] = useState("");
  const [searchFormPristine, setSearchFormPristine] = useState(false);
  const setCliente = useStore((state) => state.setCliente);
  const [loadingClient, setLoadingClient] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: "",
      apellido: "",
      sexo: "",
      dni: "",
    },
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  const onSubmit = async (payload: any) => {
    try {
      setIsLoading(true);
      const { data }: any = await http.post("/cliente", payload);
      present({
        message: data.mensaje,
        duration: 3000,
      });
      setCliente(data.respuesta[0]);
      history.push("/agregarPedido");
    } catch (error: any) {
      present({
        message: error?.response?.data?.mensaje,
        color: "danger",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const searchUser = async () => {
    try {
      setSearchFormPristine(true);
      setLoadingClient(true);
      const { data }: any = await http.get(`/cliente/dni/${dniClient}`);
      const clienteLoaded = data.respuesta[0] as ClienteType;
      if (clienteLoaded) {
        setCliente(clienteLoaded);
        history.push("/agregarPedido");
        setSearchFormPristine(false);
      }
      setValue("dni", dniClient);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoadingClient(false);
    }
  };

  const validSearchButton = () => {
    if (!dniClient) return true;
    if (dniClient.length < 8) return true;
    return false;
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" text="Volver" />
            </IonButtons>
            <IonTitle>Cliente</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonItem>
          <IonLabel position="stacked">DNI Cliente</IonLabel>
          <IonInput
            type="number"
            value={dniClient}
            onIonChange={(e) => setDniClient(e.detail.value!)}
          />
        </IonItem>
        <IonButton
          expand="block"
          disabled={validSearchButton()}
          onClick={searchUser}
        >
          Buscar
        </IonButton>
        {loadingClient && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <IonSpinner name="crescent" />
          </div>
        )}
        {searchFormPristine && !loadingClient && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <IonItem>
              <IonLabel position="stacked">Nombre</IonLabel>
              <IonInput {...register("nombre")} />
              {errors?.nombre && (
                <IonNote slot="error">{errors?.nombre?.message}</IonNote>
              )}
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Apellido</IonLabel>
              <IonInput {...register("apellido")} />
              {errors?.apellido && (
                <IonNote slot="error">{errors?.apellido?.message}</IonNote>
              )}
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Sexo</IonLabel>
              <IonSelect {...register("sexo")} interface="popover">
                <IonSelectOption value="FEMENINO">Femenino</IonSelectOption>
                <IonSelectOption value="MASCULINO">Masculino</IonSelectOption>
              </IonSelect>
              {errors?.sexo && (
                <IonNote slot="error">{errors?.sexo?.message}</IonNote>
              )}
            </IonItem>
            <IonButton expand="block" type="submit" disabled={isLoading}>
              Crear
            </IonButton>
          </form>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Cliente;
