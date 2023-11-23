import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBT3MqzkEPsuf--4dTW4yj2K2QJPWksJ6E",
  authDomain: "beefood-binusian.firebaseapp.com",
  projectId: "beefood-binusian",
  storageBucket: "beefood-binusian.appspot.com",
  messagingSenderId: "450573117232",
  appId: "1:450573117232:web:e47887b17c4e02ef37caf5",
  measurementId: "G-1RPXWNBCE8"
};

export const app = initializeApp(firebaseConfig);