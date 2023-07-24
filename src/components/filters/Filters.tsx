import {
  IonButtons,
  IonButton,
  IonIcon,
  IonPopover,
  IonAccordionGroup,
  IonAccordion,
  IonItem,
  IonLabel,
  IonNote,
  IonDatetime,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import { useState } from "react";
import shallow from "zustand/shallow";
import { usePedidoStore, pedidoStoreSelector } from "../../store/pedidosStore";
import { ESTADOS_DROPDOWN } from "../../types/estado";
import { fDate, formatFromDate } from "../../utils/formatTime";

const Filters = () => {
  const { setFiltros, clearFiltros } = usePedidoStore(
    pedidoStoreSelector,
    shallow
  );
  const [estado, setEstado] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const hadleAceptar = () => {
    setFiltros(
      {
        fromDate: desde ? formatFromDate(new Date(desde)) : "",
        toDate: hasta ? formatFromDate(new Date(hasta)) : "",
      },
      estado
    );
  };

  const handleClear = () => {
    setEstado("");
    setDesde("");
    setHasta("");
    clearFiltros();
  };

  return (
    <>
      <IonButtons slot="end">
        <IonButton id="trigger-button">
          <IonIcon slot="end" icon={ellipsisVertical} />
        </IonButton>
      </IonButtons>
      <IonPopover trigger="trigger-button">
        <IonAccordionGroup>
          <IonAccordion value="desde">
            <IonItem slot="header">
              <IonLabel>Desde</IonLabel>
              <IonNote slot="end">{desde ? fDate(desde) : ""}</IonNote>
            </IonItem>
            <IonDatetime
              slot="content"
              locale="es-ES"
              presentation="date"
              onIonChange={(ev) => setDesde(ev.detail.value!)}
            />
          </IonAccordion>
          <IonAccordion value="hasta">
            <IonItem slot="header">
              <IonLabel>Hasta</IonLabel>
              <IonNote slot="end">{hasta ? fDate(hasta) : ""}</IonNote>
            </IonItem>
            <IonDatetime
              slot="content"
              locale="es-ES"
              presentation="date"
              onIonChange={(ev) => setHasta(ev.detail.value!)}
            />
          </IonAccordion>
        </IonAccordionGroup>
        <IonItem>
          <IonLabel>Estado</IonLabel>
          <IonSelect
            value={estado}
            placeholder="Todos los estados"
            onIonChange={(e) => setEstado(e.detail.value)}
            interface="popover"
          >
            {ESTADOS_DROPDOWN.map((estado) => (
              <IonSelectOption value={estado.value} key={estado.value}>
                {estado.label}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
        <IonButton onClick={hadleAceptar}>Aplicar</IonButton>
        <IonButton onClick={handleClear} fill="outline">
          Limpiar filtros
        </IonButton>
      </IonPopover>
    </>
  );
};

export default Filters;
