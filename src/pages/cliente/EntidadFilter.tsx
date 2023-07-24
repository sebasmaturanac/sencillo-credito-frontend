import {
  IonModal,
  IonContent,
  IonButtons,
  IonToolbar,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
  IonSearchbar,
} from "@ionic/react";
import { useState } from "react";
import { Entidades } from "../../store";

interface Props {
  isOpen: boolean;
  toggleModal: () => void;
  onClickItem: (entidad: Entidades) => void;
  entidades: Entidades[];
}

const EntidadFilter = ({
  isOpen,
  toggleModal,
  entidades,
  onClickItem,
}: Props) => {
  const [searchText, setSearchText] = useState("");

  const handleClickItem = (entidad: Entidades) => () => onClickItem(entidad);

  return (
    <IonModal isOpen={isOpen}>
      <IonToolbar>
        <IonButtons slot="end">
          <IonButton onClick={toggleModal}>Cerrar</IonButton>
        </IonButtons>
      </IonToolbar>
      <IonContent>
        <IonSearchbar
          value={searchText}
          onIonChange={(e) => setSearchText(e.detail.value!)}
          placeholder="Filtrar entidades"
        />

        <IonList>
          {entidades
            .filter((entidad) =>
              entidad.nombre
                .toLocaleLowerCase()
                .includes(searchText.toLocaleLowerCase())
            )
            .map((entidad) => (
              <IonItem key={entidad.id} onClick={handleClickItem(entidad)}>
                <IonLabel>{entidad.nombre}</IonLabel>
              </IonItem>
            ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
};

export default EntidadFilter;
