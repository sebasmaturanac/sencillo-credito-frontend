import React, { useEffect, useState } from "react";
import {
  IonInput,
  IonItem,
  IonButton,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonContent,
  IonPage,
} from "@ionic/react";
import {
  Paper,
  Typography,
  ListItem,
  ListItemText,
  List,
  Button,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { InputChangeEventDetail } from "@ionic/core";
import { subscribeToChats } from "../../socket/socket";
import { http } from "../../utils/api";
import { id } from "date-fns/locale";

const ChatsMensajes: React.FC = ({ history }: any) => {
  const { title } = useParams<{ title: string }>();

  const [chats, setChats] = useState<{ id: number; content: string }[]>([]);
  const [inputText, setInputText] = useState("");

  const handleInputChange = (event: CustomEvent<InputChangeEventDetail>) => {
    const newValue = event.detail.value;
    setInputText(newValue || "");
  };

  const getChats = async (chatId: Number) => {
    try {
      const { data } = await http.get(`/chat/messages/${chatId}`);
      setChats(data);
    } catch (error) {
      console.error("chats error", error);
    }
  };

  useEffect(() => {
    // Aquí obtén el chatId de alguna manera, tal vez de la URL o de algún otro lugar
    const chatId = 1;
    subscribeToChats(getChats(chatId));
  }, []);

  const postChats = async () => {
    try {
      // Crear un chat si no existe
      const chatResponse = await http.post("/chat/createchat", {
        participant1Id:  1,
        participant2Id:  2,
      });
  
      const chatId = chatResponse.data.id; // Obtener el ID del chat creado
  
      // Enviar el mensaje al chat usando el chatId obtenido
      const messageResponse = await http.post(`/chat/messages/${chatId}`, {
        content: inputText,
        senderId: 1,
        chatId,
      });
  
      console.log("mensaje enviado", messageResponse);
      subscribeToChats(chatId); // Suscribirse a los mensajes del chat
    } catch (error) {
      console.error("chats error", error);
    } finally {
      console.log("chats ok");
      setInputText("");
    }
  };  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton
            slot="start"
            routerLink="/chats"
            routerDirection="back"
            color="secondary"
            fill="clear"
          >
            Atras
          </IonButton>
          <IonTitle>
            Mensajes
            <br />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <h1>Conversación con Usuario {title}</h1>
        <Paper elevation={1} style={{ flexGrow: 1, backgroundColor: '#B2BABB' }}>
          {chats.length > 0 ? (
            <List style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto" }}>
              {chats.map((item) => (
                <ListItem
                  key={item.id}
                  style={{
                    display: "flex",
                    marginBottom: "0px",
                    marginTop: "0px",
                    paddingBottom: "1px",
                    paddingTop: "1px",
                  }}>
                  <ListItemText
                    primary={
                      <Typography
                        variant="body2"
                        align={item.content === "mi mensaje" ? "right" : "left"}
                        style={{
                          color: item.content === 'mi mensaje' ? "#6E2C00" : "#154360",
                        }}
                        >
                        {item.content}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              variant="body1"
              style={{ textTransform: "uppercase", fontWeight: "bold" }}
            >
              Sin mensajes
            </Typography>
          )}
        </Paper>

        <div style={{ position: "absolute", bottom: 0, width: "100%" }}>
          <IonItem>
            <IonInput
              placeholder="Ingrese su texto aquí"
              value={inputText}
              onIonChange={handleInputChange}
              style={{ width: "100%" }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  postChats();
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
      </IonContent>
    </IonPage>
  );
};

export default ChatsMensajes;
