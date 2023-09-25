import OneSignal from "onesignal-cordova-plugin";
import { useIonToast } from "@ionic/react";
import { useEffect } from "react";
import { http } from "./api";

export const useOneSignal = () => {
  const [present, dismiss] = useIonToast();

  useEffect(() => {
    /*const oneSignalInit = () => {
      OneSignal.setLogLevel(6, 0);

      OneSignal.setAppId("630e90d8-56ec-45a8-8bf5-ad0297702c12");

      OneSignal.getDeviceState((state) => {
        const pushNotificationToken = state.userId;
        http.post("/auth/update-push-notification-token", {
          pushNotificationToken,
        });
      });

      OneSignal.setNotificationWillShowInForegroundHandler((notification) => {
        // Complete with null means don't show a notification
        notification.complete(null);
        present({
          buttons: [{ text: "hide", handler: () => dismiss() }],
          message: "toast from hook, click hide to dismiss",
          position: "top",
          duration: 1500,
        });
      });

      OneSignal.setNotificationOpenedHandler(function (jsonData) {
        console.log("notificationOpenedCallback: " + JSON.stringify(jsonData));
      });

      // iOS - Prompts the user for notification permissions.
      //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 6) to better communicate to your users what notifications they will get.
      OneSignal.promptForPushNotificationsWithUserResponse(function (accepted) {
        console.log("User accepted notifications: " + accepted);
      });
    };*/
    //oneSignalInit();
  }, [present, dismiss]);
};
