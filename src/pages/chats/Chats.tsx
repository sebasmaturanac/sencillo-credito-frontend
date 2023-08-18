import React from 'react';
import {
  IonAvatar,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonChip,
  IonRouterLink,
} from "@ionic/react";
//import { Link } from 'react-router-dom';

const Chats: React.FC = ({ history }: any) => {
  const chatList = [
    {
      id: '1',
      avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
      title: 'Autorizador',
      subtitle: 'Último mensaje',
    },
    {
      id: '2',
      avatar: 'https://avatars.githubusercontent.com/u/80540635?v=5',
      title: 'Comercializador',
      subtitle: 'Último mensaje',
    },
    // Agrega más elementos de chat si es necesario
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>
            Contactos<br />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {chatList.map((contact) => (
          <div key={contact.id} style={{ display: 'block', border: '4px'}}>
            <IonChip>
              <IonAvatar>
                <img alt="Avatar" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
              </IonAvatar>
              <IonLabel>
                <IonRouterLink href={`/chat/${contact.title}`}>{contact.title}</IonRouterLink>
              </IonLabel>
            </IonChip>
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Chats;
