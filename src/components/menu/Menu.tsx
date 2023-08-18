import {
  IonButton,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from "@ionic/react";

import { useHistory, useLocation } from "react-router-dom";
import { homeOutline, homeSharp, cashOutline, cashSharp, mail, mailOutline, mailSharp } from "ionicons/icons";
import "./Menu.css";
import shallow from "zustand/shallow";
import { usePedidoStore, pedidoStoreSelector } from "../../store/pedidosStore";
import { canViewEstadoCuenta } from "../../utils/userRole";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const getComisionesMenu = () =>
  canViewEstadoCuenta()
    ? [
        {
          title: "Estado de cuenta",
          url: "/estadoCuenta",
          iosIcon: cashOutline,
          mdIcon: cashSharp,
        },
      ]
    : [];
    
    const getChatMenu = () =>
      canViewEstadoCuenta()
        ? [
            {
              title: "Chats",
              url: "/chats", 
              iosIcon: mailOutline,
              mdIcon: mailSharp,
            },
          ]
        : [];

const appPages: AppPage[] = [
  {
    title: "Inicio",
    url: "/home",
    iosIcon: homeOutline,
    mdIcon: homeSharp,
  },
  ...getComisionesMenu(),
  ...getChatMenu(),
];

/*const appChats: AppPage[] = [
  {
    title: "Chats",
    url: "/home",
    iosIcon: mailOutline,
    mdIcon: mailSharp,
  },
];*/

const Menu: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { resetStore } = usePedidoStore(pedidoStoreSelector, shallow);

  const logout = async () => {
    localStorage.clear();
    resetStore();
    history.push("/login", {
      direction: "back",
    });
  };

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list">
          <IonListHeader>Sencillo Créditos</IonListHeader>
          <IonNote className="menu-user-container">
            {localStorage.getItem("username")}
            <IonMenuToggle>
              <IonButton fill="clear" onClick={logout}>
                salir
              </IonButton>
            </IonMenuToggle>
          </IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index}>
                <IonItem
                  className={
                    location.pathname === appPage.url ? "selected" : ""
                  }
                  routerLink={appPage.url}
                  routerDirection="none"
                  lines="none"
                  detail={false}
                >
                  <IonIcon
                    slot="start"
                    ios={appPage.iosIcon}
                    md={appPage.mdIcon}
                  />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
