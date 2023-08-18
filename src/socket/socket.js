//import baseURL from "config/url";
import openSocket from "socket.io-client";
import { baseURL } from "../config/url";

const socket = openSocket(baseURL.replace(".ar/api", ".ar"));

socket.on("connected", () => console.log("Socket Conectado")); //eslint-disable-line


export const subscribeToChats = (handleSocketUpdate) => {
  socket.on("Chats", handleSocketUpdate);
};

export const unSubscribeAll = () => {
  socket.off();
};


