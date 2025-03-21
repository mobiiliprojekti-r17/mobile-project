// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Firebase-konfiguraatio
const firebaseConfig = {
  apiKey: "AIzaSyBfG_fvEg9aoYsYzN_NJM0jszXN6iHLbDM",
  authDomain: "minigames-r17.firebaseapp.com",
  projectId: "minigames-r17",
  storageBucket: "minigames-r17.firebasestorage.app",
  messagingSenderId: "846863822774",
  appId: "1:846863822774:web:905bb91a92f3aa7062db17"
};

initializeApp(firebaseConfig);

// Alustetaan Firestore
const firestore = getFirestore();

const MESSAGES = 'messages';

export { firestore, collection, addDoc, MESSAGES };
