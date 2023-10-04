import React, { useState, useEffect } from "react";
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
} from "@ionic/react";
import { useHistory, useParams } from "react-router-dom"; // Importa useHistory
import { http } from "../../utils/api";

const Chats: React.FC = () => {
  const history = useHistory(); // Obtiene la instancia de useHistory
  const [chatList, setChatList] = useState<
    { id: number; avatar: string; title: string; subtitle: string }[]
  >([]);
  const [ChatListComercializadora, setChatListComercializadora] = useState<
    { id: number; avatar: string; title: string; subtitle: string }[]
  >([]);
  const { id } = useParams<{ id: any }>();

  const handleChatSelection = async (id2: any) => {
    try {
      const claveId = localStorage.getItem("id");
      console.log(claveId);

      console.log(id2);
      const chatResponse = await http.post("/chat/createchat", {
        participant1Id: claveId,
        participant2Id: id2,
      });

      const chatId = chatResponse.data.respuesta; // Obtener el ID del chat creado
      const idChat = chatId[0].id;
      // Navega a la página ChatMensajes y pasa el chatId como parámetro
      console.log(chatId[0].id);

      history.push(`/chat/${idChat}`);
    } catch (error) {
      console.error("La instancia de chat no se creó correctamente", error);
    }
  };

  const [loading, setLoading] = useState(true);
  const [loadingComercializadora, setLoadingComercializadora] = useState(true);
  const [usuariosFiltered, setUsuariosFiltered] = useState([]);
  const [selectedItem, setSelectedItem] = useState();

  const handleItemClick = (item: any) => {
    console.log("item click....", item);
    setSelectedItem(item);
    handleChatSelection(item.id);
  };

  const getUsuarios = async () => {
    try {
      setLoading(true);
      const autorizadores = await http.get("/chat/getUserByVendedor");
      console.log("Autorizador:", autorizadores);

      if (autorizadores.data && autorizadores.data.respuesta) {
        const usuarios = autorizadores.data.respuesta;

        // Genera el array chatList basado en los usuarios
        const newChatList = usuarios.map((usuario: any) => ({
          id: usuario.id.toString(), // Asegura que el ID sea una cadena
          avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
          title: `${usuario.name} (${usuario.role})`,
          subtitle: "Último mensaje",
        }));
        setChatList(newChatList);
        console.log("Usuarios Autorizadores obtenidos:", newChatList);
      } else {
        console.error(
          'La respuesta de la API no contiene la propiedad "respuesta" esperada:',
          autorizadores
        );
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const getUsuariosComercializadora = async (id: any) => {
    try {
      setLoadingComercializadora(true);

      const comercializadores = await http.get(`/chat/getUserComercializadora/${id}`);

      console.log("comercializador:", comercializadores);

      if (comercializadores.data && comercializadores.data.respuesta) {
        const usuarios = comercializadores.data.respuesta;
        // Aquí puedes obtener el ID del usuario de la comercializadora si existe
        if (usuarios.length > 0) {
          const idUsuarioComercializadora = usuarios[0].id;
          history.push(`/chats/${id}`);
          console.log("ID del usuario de la comercializadora:", idUsuarioComercializadora);
        }

        const newChatList = usuarios.map((usuario: any) => ({
          id: usuario.id.toString(),
          avatar: "https://avatars.githubusercontent.com/u/80540635?v=4",
          title: `${usuario.name} (${usuario.role})`,
          subtitle: "Último mensaje",
        }));
        setChatListComercializadora(newChatList);
        console.log("Usuarios Comercializadores obtenidos:", newChatList);
      } else {
        console.error(
          'La respuesta de la API no contiene la propiedad "respuesta" esperada:',
          comercializadores
        );
      }
    } catch (error) {
      console.error("Error al obtener usuarios de comercializadoras:", error);
    } finally {
      setLoadingComercializadora(false);
    }
  };

  useEffect(() => {
    getUsuariosComercializadora(4);
    getUsuarios();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>
            Contactos
            <br />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {chatList.map((contact) => (
          <div
            key={contact.id}
            style={{
              display: "block",
              border: "4px",
            }}
          >
            <IonChip onClick={() => handleItemClick(contact)}>
              <IonAvatar>
                <img alt="Avatar" src={contact.avatar} />
              </IonAvatar>
              <IonLabel>{contact.title}</IonLabel>
            </IonChip>
          </div>
        ))}
        {ChatListComercializadora.map((contact) => (
          <div
            key={contact.id}
            style={{
              display: "block",
              border: "4px",
            }}
          >
            <IonChip onClick={() => handleItemClick(contact)}>
              <IonAvatar>
                <img alt="Avatar" src={contact.avatar} />
              </IonAvatar>
              <IonLabel>{contact.title}</IonLabel>
            </IonChip>
          </div>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Chats;
