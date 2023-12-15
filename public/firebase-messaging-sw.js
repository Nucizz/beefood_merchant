importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js')

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./firebase-messaging-sw.js')
    .then(function(registration) {
        console.log('Registration successful, scope is:', registration.scope)
    }).catch(function(err) {
        console.log('Service worker registration failed, error:', err)
    })
}

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyBT3MqzkEPsuf--4dTW4yj2K2QJPWksJ6E",
    authDomain: "beefood-binusian.firebaseapp.com",
    projectId: "beefood-binusian",
    storageBucket: "beefood-binusian.appspot.com",
    messagingSenderId: "450573117232",
    appId: "1:450573117232:web:e47887b17c4e02ef37caf5",
    measurementId: "G-1RPXWNBCE8"
}

firebase.initializeApp(FIREBASE_CONFIG)
const messaging = firebase.messaging()

messaging.onBackgroundMessage(function(payload) {
    console.log('Received background message ', payload)

    const notificationTitle = payload.notification.title
    const notificationOptions = {
        body: payload.notification.body,
    }

    self.registration.showNotification(notificationTitle, notificationOptions)
})