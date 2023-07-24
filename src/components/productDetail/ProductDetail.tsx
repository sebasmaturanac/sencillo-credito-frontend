import {
  IonModal,
  IonContent,
  IonButtons,
  IonTitle,
  IonToolbar,
  IonButton,
} from "@ionic/react";
import { PedidosEntity } from "../../store/pedidosStore";
import { ESTADOS } from "../../types/estado";
import { canViewComisiones } from "../../utils/userRole";
import CardDetail from "../../pages/home/CardDetail";
import { getCliente, getDetalle, getAutorizador, getComision } from "../../pages/home/mapper";

interface Props {
  isOpen: boolean;
  toggleModal: () => void;
  pedido: PedidosEntity | undefined;
}

const ProductDetail = ({ isOpen, toggleModal, pedido }: Props) => {
  const estadoPedido = pedido?.estado?.estado;
  
  return (
    <IonModal isOpen={isOpen} backdropDismiss={false}>
      <IonToolbar>
        <IonButtons slot="end">
          <IonButton onClick={toggleModal}>Cerrar</IonButton>
        </IonButtons>
        <IonTitle>Pedido detalle</IonTitle>
      </IonToolbar>
      <IonContent>
        <CardDetail title="Cliente" list={getCliente(pedido!)} />
        <CardDetail title="Detalle" list={getDetalle(pedido!)} />
        {(estadoPedido === ESTADOS.APROBADO ||
          estadoPedido === ESTADOS.RECHAZADO) && (
          <CardDetail title="Autorizador" list={getAutorizador(pedido!)} />
        )}
        {estadoPedido === ESTADOS.APROBADO && canViewComisiones() && (
          <CardDetail title="Comision" list={getComision(pedido!)} />
        )}
      </IonContent>
    </IonModal>
  );
};

export default ProductDetail;
