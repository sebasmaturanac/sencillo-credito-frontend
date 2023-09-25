import React, { useEffect, useState, useRef } from "react";
import {
  IonInput,
  IonItem,
  IonButton,
  IonToolbar,
  IonTitle,
  IonHeader,
  IonContent,
  IonPage,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonButtons,
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
import { send, attachOutline, arrowBackOutline } from "ionicons/icons";

const ChatsMensajes: React.FC = ({ history }: any) => {

  const { chatId } = useParams<{ chatId: string }>();
  const [chats, setChats] = useState<
    { id: number; content: string; senderId: string; resourceLink: string }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const [idChat, setIdChat] = useState();
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Inicializa selectedFile como null
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const initialId = localStorage.getItem("id") || ''; // Asigna una cadena vacía si sessionStorage.getItem("id") es null

  const [miId, setIdLocal] = useState<string | ''>(initialId);


  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Obtén el primer archivo seleccionado
    if (file) {
      setSelectedFile(file); // Asigna el archivo solo si no es undefined
    }
  };

  const handleInputChange = (event: CustomEvent<InputChangeEventDetail>) => {
    const newValue = event.detail.value;
    setInputText(newValue || "");
    if (selectedFile) {
      // Realiza la carga del archivo
      console.log("Archivo seleccionado:", selectedFile);
    }
  };

  const getChats = async (chatId: string) => {
    try {
      console.log(chatId);
      const { data } = await http.get(`/chat/messages/${chatId}`);
      console.log("getChats", data.respuesta);
      setChats(data.respuesta);
    } catch (error) {
      console.error("chats error", error);
    }
  };

    useEffect(() => {
      // Suscribe al socket para recibir actualizaciones de chats
      subscribeToChats((updatedChats : any) => {
        // Actualiza el estado 'chats' con los nuevos mensajes
        setChats(updatedChats);
      });
    
      // También obtén los chats iniciales
      getChats(chatId);
    }, [chatId, chats.length]);

  const postChats = async () => {
    try {

      if (selectedFile === null) {
        try {
          const response = await http.post("/chat/messages", {
            content: inputText,
            chatId: chatId,
            senderId: miId,
          });
          console.log("chats sokcet", response);
          subscribeToChats(getChats(chatId));
        } catch (error) {
          console.log("chats error ");
        } finally {
          console.log("chats ok");
          setInputText("");
        }
      } else {
        // enviar pero con form data el archivo adjunto
        // Enviar el archivo adjunto utilizando FormData
        const formData = new FormData();
        formData.append("content", inputText);
        formData.append("chatId", chatId);
        formData.append("senderId", miId);
        formData.append("file", selectedFile); // Asegúrate de tener la variable 'file' que contiene el archivo

        try {
          const response = await http.post("/chat/messages", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("chats socket con archivo adjunto", response);
          subscribeToChats(getChats(chatId));
        } catch (error) {
          console.error("chats error con archivo adjunto", error);
        } finally {
          console.log("chats ok con archivo adjunto");
          setInputText("");
        }
      }
    } catch (error) {
      console.error("chats error", error);
    } finally {
      console.log("chats ok");
      setInputText("");
      setSelectedFile(null);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
        <IonButtons slot="start">
      <IonButton
        color="secondary"
        fill="clear"
        routerLink="/chats"
        routerDirection="back"
      >
        <IonIcon icon={arrowBackOutline} /> {/* Reemplaza arrowBackOutline con el icono deseado */}
      </IonButton>
    </IonButtons>
          <IonTitle>
            Mensajes
            <br />
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {/*<h1>Conversación con Usuario {title}</h1>*/}
        <Paper
          elevation={1}
          style={{ flexGrow: 1, backgroundColor: "#B2BABB" }}
        >
          {chats?.length > 0 ? (
            <List
              style={{ maxHeight: "calc(100vh - 250px)", overflowY: "auto" }}
            >
              {chats.map((item) => (
                <ListItem
                  key={item.id}
                  style={{
                    display: "flex",
                    marginBottom: "0px",
                    marginTop: "0px",
                    paddingBottom: "1px",
                    paddingTop: "1px",
                    justifyContent:
                      parseInt(item.senderId, 10) === parseInt(miId, 10)
                        ? "flex-end"
                        : "flex-start",
                  }}
                >
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column", // Para colocar contenido y recurso en columnas separadas
                        alignItems:
                          parseInt(item.senderId, 10) === parseInt(miId, 10)
                            ? "flex-end"
                            : "flex-start",
                      }}
                    >
                      <div>
                        <IonText
                          color={
                            parseInt(item.senderId, 10) === parseInt(miId, 10)
                              ? "danger" // Cambia el color según tus preferencias
                              : "primary"
                          }
                          className={
                            parseInt(item.senderId, 10) === parseInt(miId, 10)
                              ? "ion-text-end" // Alinea a la derecha si el remitente coincide con el usuario actual
                              : ""
                          }
                        >
                          {item.content}
                        </IonText>
                      </div>
                      {item.resourceLink ? (
                        <div>
                          {item.resourceLink.endsWith(".pdf") ? (
                            <div>
                              <embed
                                src={item.resourceLink}
                                type="application/pdf"
                                width="200px"
                                height="220px"
                              />
                              <br />
                              <a href={item.resourceLink} download>
                                Descargar PDF
                              </a>
                            </div>
                          ) : item.resourceLink.match(
                              /\.(jpeg|jpg|png|gif)$/i
                            ) ? (
                            <div>
                              <a href={item.resourceLink} download>
                                <img
                                  src={item.resourceLink}
                                  alt="Imagen"
                                  style={{
                                    maxWidth: "200px",
                                    maxHeight: "220px",
                                  }}
                                />
                              </a>
                            </div>
                          ) : (
                            <a
                              href={item.resourceLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Ver recurso
                            </a>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
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

        <div style={{ position: "absolute", bottom: 0, width: "100%", alignItems: "center"}}>
          <IonGrid>
            <IonRow>
              <IonCol size="10">
                <IonInput
                  placeholder="Ingrese su texto aquí"
                  value={inputText}
                  onIonChange={handleInputChange}
                  clearInput
                  style={{ border: "1px solid #ccc" }}
                ></IonInput>
                <input
                  type="file"
                  accept=".pdf, .jpg, .jpeg, .png" // Acepta archivos PDF e imágenes
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                  ref={fileInputRef}
                />
              </IonCol>
              <IonCol size="2">
                <IonButton
                  fill="clear"
                  color="primary"
                  size="small"
                  onClick={postChats}
                >
                  <IonIcon icon={send} />
                </IonButton>
                <IonButton
                  fill="clear"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <IonIcon icon={attachOutline} slot="start" />
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ChatsMensajes;
