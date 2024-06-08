importScripts(
    "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./firebase-messaging-sw.js")
        .then(function (registration) {
            console.log("Registration successful, scope is:", registration.scope);
        })
        .catch(function (err) {
            console.log("Service worker registration failed, error:", err);
        });
}

const FIREBASE_CONFIG = {
    apiKey: process.env.FIREBASE_CONFIG_API_KEY,
    authDomain: process.env.FIREBASE_CONFIG_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_CONFIG_PROJECT_ID,
    storageBucket: process.env.FIREBASE_CONFIG_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_CONFIG_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_CONFIG_APP_ID,
    measurementId: process.env.FIREBASE_CONFIG_MEASUREMENT_ID,
};

firebase.initializeApp(FIREBASE_CONFIG);
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log("Received background message ", payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
