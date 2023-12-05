import { initializeApp } from "firebase/app";
import { getToken } from "firebase/messaging";
import { getMessaging } from 'firebase/messaging/sw'

const FIREBASE_CONFIG = {
  // YOUR FIREBASE CONFIG HERE
}

const MESSAGING_KEY = // YOUR FIREBASE CLOUD MESSAGING KEY HERE

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
