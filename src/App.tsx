import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import Menu from "./components/menu/Menu";
import Home from "./pages/home/Home";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import Login from "./pages/login/Login";
import PrivateRoute from "./components/privateRoute/PrivateRoute";
import PublicRoute from "./components/privateRoute/PublicRoute";
import Cliente from "./pages/cliente/Cliente";
import Pedido from "./pages/cliente/Pedido";
import EstadoCuenta from "./pages/estadoCuenta/EstadoCuenta";
import Chats from "./pages/chats/Chats";
import ChatsMensajes from "./pages/chats/ChatsMensajes";
import UploadPicturePedido from "./pages/uploadPicturePedido/UploadPicturePedido";

setupIonicReact();

const App: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <Menu />
        <IonRouterOutlet id="main" basePath="login">
          <Route path="/" exact={true}>
            <Redirect to="/home" />
          </Route>
          <PrivateRoute path="/home" component={Home} exact={true} />
          <PrivateRoute
            path="/estadoCuenta"
            component={EstadoCuenta}
            exact={true}
          />
          <PrivateRoute
            path="/agregarCliente"
            component={Cliente}
            exact={true}
          />
          <PrivateRoute
            path="/chats"
            component={Chats}
            exact={true}
          />
          <PrivateRoute
            path="/chat/:chatId"
            component={ChatsMensajes}
            exact={true}
          />
          <PrivateRoute path="/agregarPedido" component={Pedido} exact={true} />
          <PrivateRoute
            path="/agregarFotosPedido/:pedidoId"
            component={UploadPicturePedido}
            exact={true}
          />
          <PublicRoute path="/login" component={Login} exact={true} />
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
