import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// KEY
console.log(process.env)
const FIREBASE_CONFIG = {
  apiKey: process.env.REACT_APP_FIREBASE_CONFIG_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_CONFIG_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_CONFIG_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_CONFIG_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_CONFIG_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_CONFIG_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_CONFIG_MEASUREMENT_ID,
};

const MESSAGING_KEY = process.env.REACT_APP_MESSAGING_KEY;
const SERVER_MESSAGING_KEY = process.env.REACT_APP_SERVER_MESSAGING_KEY;

// APP
export const app = initializeApp(FIREBASE_CONFIG);

// FCM
export const messaging = getMessaging(app);

export const getFCMToken = async () => {
  try {
    const currentToken = await getToken(messaging, { vapidKey: MESSAGING_KEY });
    if (currentToken) {
      console.log("CLIENT TOKEN: ", currentToken);
      return currentToken;
    } else {
      console.log(
        "No registration token available. Request permission to generate one."
      );
    }
  } catch (err) {
    console.log("An error occurred while retrieving token. ", err);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export const sendFCMMessage = async (token, messageTitle, messageBody) => {
  const requestBody = {
    to: token,
    notification: {
      title: messageTitle,
      body: messageBody,
    },
  };

  try {
    const response = await fetch("https://fcm.googleapis.com/fcm/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${SERVER_MESSAGING_KEY}`,
      },
      body: JSON.stringify(requestBody),
    });

    const result = await response.json();
    console.log("FCM Message sent:", result);
    return true;
  } catch (error) {
    console.error("Error sending FCM message:", error);
    return false;
  }
};
