import {
  IonButtons,
  IonButton,
  IonIcon,
  IonPopover,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonAccordion,
  IonAccordionGroup,
  IonDatetime,
  IonNote,
} from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import { useState } from "react";
import shallow from "zustand/shallow";
import {
  estadoCuentaStoreSelector,
  useEstadoCuentaStore,
} from "../../store/estadoCuentaStore";
import { COMISION_ESTADOS_DROPDOWN } from "../../types/comision";
import { fDate, formatFromDate } from "../../utils/formatTime";

const FiltersEstadoCuenta = () => {
  const { setFiltros, clearFiltros } = useEstadoCuentaStore(
    estadoCuentaStoreSelector,
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
        <IonButton id="trigger-button-estado-cuenta">
          <IonIcon slot="end" icon={ellipsisVertical} />
        </IonButton>
      </IonButtons>
      <IonPopover
        trigger="trigger-button-estado-cuenta"
        className="custom-popover"
      >
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
            {COMISION_ESTADOS_DROPDOWN.map((estado) => (
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

export default FiltersEstadoCuenta;
