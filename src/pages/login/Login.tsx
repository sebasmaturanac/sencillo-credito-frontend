import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  useIonToast,
} from "@ionic/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import logo from "../../assets/img/sencilloLogo.png";
import styles from "./login.module.css";
import { http } from "../../utils/api";
import { useState } from "react";

const schema = yup.object({
  username: yup.string().required("El usuario es requerido"),
  password: yup.string().required("La contraseña es requerida"),
});

const Login = ({ history }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [present] = useIonToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: yupResolver(schema),
    reValidateMode: "onChange",
  });

  const onSubmit = async (payload: any) => {
    try {
      setIsLoading(true);
      const { data }: any = await http.post("/auth/login", payload);
      present({
        message: data.mensaje,
        duration: 3000,
      });
      localStorage.setItem("token", data?.respuesta[0].token);
      localStorage.setItem("username", data?.respuesta[0].username);
      localStorage.setItem("role", data?.respuesta[0].role);
      localStorage.setItem("name", data?.respuesta[0].name);
      localStorage.setItem("id", data?.respuesta[0].id);
      localStorage.setItem(
        "comercializadoraId",
        data?.respuesta[0].comercializadoraId
      );
      setIsLoading(false);
      history.push("/home");
    } catch (error: any) {
      present({
        message: error?.response?.data?.mensaje,
        color: "danger",
        duration: 3000,
      });
      setIsLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen scrollY={false}>
        <div className={styles.container}>
          <IonCard className={styles.cardContainer}>
            <IonCardHeader>
              <IonCardTitle>
                <IonImg src={logo} />
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <IonItem className={styles.input}>
                  <IonLabel position="stacked">Usuario</IonLabel>
                  <IonInput {...register("username")} />
                  {errors?.username && (
                    <IonNote slot="error" className={styles.note}>
                      {errors?.username?.message}
                    </IonNote>
                  )}
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">Contraseña</IonLabel>
                  <IonInput {...register("password")} type="password" />
                  {errors?.password && (
                    <IonNote slot="error" className={styles.note}>
                      {errors?.password?.message}
                    </IonNote>
                  )}
                </IonItem>
                <IonButton
                  expand="block"
                  className={styles.button}
                  type="submit"
                  disabled={isLoading}
                >
                  Ingresar
                </IonButton>
              </form>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
