///***Generando RELEASE ANDROID***///
Los proyectos de @ionic/react, se fomenta el uso de Capacitor en lugar de Cordova para el desarrollo de aplicaciones móviles.

MIGRAR EL PROYECTO A CAPACITOR


1 - npm install -g @capacitor/cli  ----> (Instala Capacitor Globalmente)
2 - npx cap init ----> (Inicia Capacitor en tu Proyecto)
3 - npx cap add android ----> (Agrega Plataformas (por ejemplo, Android))
4 - npm run build ----> (Compila tu Aplicación)
5 - npx cap copy ----> (Copia tus Archivos)
6 - npx cap open android ----> (Abre tu Proyecto en Android Studio)
7 - Usa Capacitor Plugins ----> Capacitor también proporciona plugins para acceder a características nativas del dispositivo. Puedes instalar plugins de Capacitor según sea necesario para tu aplicación
 

//Publicar App Android//
Objetivo:  1 - firmar App
           2 - Subir a consola Developer de Google Play Store

1 - Firmar tu app : https://developer.android.com/studio/publish/app-signing?hl=es-419#generate-key