import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";  // Lisää getDocs tuontiin

const firebaseConfig = {
  apiKey: "AIzaSyBfG_fvEg9aoYsYzN_NJM0jszXN6iHLbDM",
  authDomain: "minigames-r17.firebaseapp.com",
  projectId: "minigames-r17",
  storageBucket: "minigames-r17.appspot.com",
  messagingSenderId: "846863822774",
  appId: "1:846863822774:web:905bb91a92f3aa7062db17"
};

// Alustetaan Firebase-sovellus
const app = initializeApp(firebaseConfig);

// Alustetaan Firestore ja annetaan sille muuttujan nimi "db"
const db = getFirestore(app);

export { db, collection, addDoc, getDocs };  // Viedään db, collection, addDoc ja getDocs