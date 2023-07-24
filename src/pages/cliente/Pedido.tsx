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
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRef, useState } from "react";
import * as yup from "yup";
import { http } from "../../utils/api";
import { Entidades, useStore } from "../../store";
import EntidadFilter from "./EntidadFilter";
import { Cliente } from "../home/homeTypes";
import shallow from "zustand/shallow";
import { usePedidoStore, pedidoStoreSelector } from "../../store/pedidosStore";

const schema = yup.object({
  entidad: yup.string().required("La entidad es requerida"),
  tipoConsulta: yup.string().required("Tipo consulta es requerida"),
  monto: yup.string().required("El monto es requerido"),
  comentarioVendedor: yup.string(),
});

const Pedido = ({ history }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [present] = useIonToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const entidades = useStore((state) => state.entidades);
  const tipoConsultas = useStore((state) => state.tipoConsultas);
  const cliente: Cliente = useStore((state) => state.cliente!);
  const entidadId = useRef(0);
  const { resetPage } = usePedidoStore(pedidoStoreSelector, shallow);

  const toggleModal = () => setIsModalOpen((state) => !state);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      entidad: "",
      tipoConsulta: "",
      monto: "",
      comentarioVendedor: "",
    },
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  const onSubmit = async (pedidoData: any) => {
    try {
      setIsLoading(true);
      const payload = {
        clienteId: cliente.id,
        entidadId: entidadId.current,
        tipoConsultaId: parseInt(pedidoData.tipoConsulta),
        montoSolicitado: parseFloat(pedidoData.monto),
        comentarioVendedor: pedidoData.comentarioVendedor,
      };
      const { data }: any = await http.post("/pedido", payload);
      present({
        message: data.mensaje,
        duration: 3000,
      });
      reset();
      resetPage();
      history.push(`/agregarFotosPedido/${data?.respuesta[0]?.id}`);
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

  const handleClickItem = (entidad: Entidades) => {
    toggleModal();
    entidadId.current = entidad.id;
    setValue("entidad", entidad.nombre);
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/home" text="Volver" />
            </IonButtons>
            <IonTitle>
              {cliente?.apellido}, {cliente?.nombre}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <IonItem onClick={toggleModal}>
            <IonLabel position="stacked">Entidad</IonLabel>
            <IonInput {...register("entidad")} />
            {errors?.entidad && (
              <IonNote slot="error">{errors?.entidad?.message}</IonNote>
            )}
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Tipo consulta</IonLabel>
            <IonSelect {...register("tipoConsulta")} interface="popover">
              {tipoConsultas.map((consulta) => (
                <IonSelectOption key={consulta.id} value={consulta.id}>
                  {consulta.nombre}
                </IonSelectOption>
              ))}
            </IonSelect>
            {errors?.tipoConsulta && (
              <IonNote slot="error">{errors?.tipoConsulta?.message}</IonNote>
            )}
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Monto</IonLabel>
            <IonInput {...register("monto")} type="number" />
            {errors?.monto && (
              <IonNote slot="error">{errors?.monto?.message}</IonNote>
            )}
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Comentario vendedor</IonLabel>
            <IonTextarea {...register("comentarioVendedor")} />
            {errors?.comentarioVendedor && (
              <IonNote slot="error">
                {errors?.comentarioVendedor?.message}
              </IonNote>
            )}
          </IonItem>
          <IonButton expand="block" type="submit" disabled={isLoading}>
            Crear
          </IonButton>
        </form>
        <EntidadFilter
          isOpen={isModalOpen}
          toggleModal={toggleModal}
          entidades={entidades}
          onClickItem={handleClickItem}
        />
      </IonContent>
    </IonPage>
  );
};

export default Pedido;
