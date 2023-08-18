import { IonInput, IonItem, IonLabel, IonButton, IonToolbar, IonButtons, IonTitle, IonMenuButton, IonHeader, IonBackButton} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { InputChangeEventDetail } from "@ionic/core"; // Importa InputChangeEventDetail
import "react-chat-elements/dist/main.css";
import { useParams } from "react-router-dom";
import { subscribeToChats } from "../../socket/socket";
import { http } from "../../utils/api";
import { TextField, Button } from "@material-ui/core";
import { Link } from 'react-router-dom';
import { caretBack } from 'ionicons/icons';


const ChatsMensajes: React.FC = ({ history }: any) => {
  const { title } = useParams<{ title: string }>();

  const [chats, setChats] = useState([]);
  const [inputText, setInputText] = useState("");
  const [selectedItem, setSelectedItem] = useState();

  /*const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };*/
  const handleInputChange = (event: CustomEvent<InputChangeEventDetail>) => {
    const newValue = event.detail.value; // Obtén el valor del evento personalizado de Ionic
    setInputText(newValue || "");
  };

  const getChats = async () => {
    try {
      const { data } = await http.get("/chat/messages");
      setChats(data);
    } catch (error) {
      console.log("chats error", error);
    }
  };

  useEffect(() => {
    subscribeToChats(getChats());
  }, []);

  const postChats = async () => {
    if (selectedItem === undefined || selectedItem === null) return;
    try {
      const response = await http.post("/chat/messages", {
        content: inputText,
      });
      console.log("chats socket", response);
      subscribeToChats(getChats());
    } catch (error) {
      console.log("chats error ");
    } finally {
      console.log("chats ok");
      setInputText("");
    }
  };

  return (
    <div>
      <IonHeader>
        <IonToolbar>
        <IonButton slot="start" routerLink="/chats" routerDirection="back" color="secondary" fill="clear">
            Atras
          </IonButton>
          <IonTitle>
            Mensajes
            <br />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <h1>Conversación con Usuario {title}</h1>
      {/* Renderizar los mensajes usando el componente MessageBox */}
      {chats.map((message, i) => (
        //Cada mesanje debe ser unico y se le agrega un key
        <li key={i}>
          {message}:{message}
        </li>
      ))}

      <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
        {/* Agregar el TextField y el Button para enviar mensajes */}
        <IonItem>
          <IonInput
            placeholder="Ingrese su texto aquí"
            value={inputText}
            onIonChange={handleInputChange}
            style={{ width: "100%" }} // Establece el ancho al 100%
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Evita el comportamiento predeterminado (por ejemplo, cambio de línea)
                postChats(); // Llama a la función para enviar el mensaje
              }
            }}
          />
        </IonItem>
        <Button
          variant="contained"
          color="primary"
          onClick={postChats}
          style={{ width: "100%" }}
        >
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default ChatsMensajes;
