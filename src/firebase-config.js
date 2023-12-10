import { initializeApp } from "firebase/app";
import { getToken } from "firebase/messaging";
import { getMessaging } from 'firebase/messaging/sw'

const FIREBASE_CONFIG = 

const MESSAGING_KEY = 

export const app = initializeApp(FIREBASE_CONFIG)

export const getFCMToken = async () => {
  try {
    const currentToken = await getToken(getMessaging(app), { vapidKey: MESSAGING_KEY });
    if (currentToken) {
      console.log('current token for client: ', currentToken);
    } else {
      console.log('No registration token available. Request permission to generate one.');
    }
  } catch (err) {
    console.log('An error occurred while retrieving token. ', err);
  }
}
