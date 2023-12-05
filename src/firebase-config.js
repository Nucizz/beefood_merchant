import { initializeApp } from "firebase/app";
import { getToken } from "firebase/messaging";
import { getMessaging } from 'firebase/messaging/sw'

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBT3MqzkEPsuf--4dTW4yj2K2QJPWksJ6E",
  authDomain: "beefood-binusian.firebaseapp.com",
  projectId: "beefood-binusian",
  storageBucket: "beefood-binusian.appspot.com",
  messagingSenderId: "450573117232",
  appId: "1:450573117232:web:e47887b17c4e02ef37caf5",
  measurementId: "G-1RPXWNBCE8"
}

const MESSAGING_KEY = "BN_jQ2yOdiqIMZSGe5-SBg8EKY7aiunu5bUG_NEc4Ky1B6Kdgt-DdxsBZi62oyXnphRIgeAjmTzlQcC_TEdVbWc"

export const app = initializeApp(FIREBASE_CONFIG)

export const getFCMToken = async (setTokenFound) => {
  try {
    const currentToken = await getToken(getMessaging(app), { vapidKey: MESSAGING_KEY });
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setTokenFound(true);
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }
}
