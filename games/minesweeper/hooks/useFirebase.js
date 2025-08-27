import { collection, addDoc } from "firebase/firestore"; 
import { db } from "../../../firebase/Config";            // Oma Firebase‑tietokantayhteys

// Tallentaa pelituloksen Firestoreen
export const saveMinesweeperResult = async (nickname, difficulty, time) => {
  try {
    // addDoc luo uuden dokumentin määritettyyn kokoelmaan
    await addDoc(
      collection(db, "MinesweeperResults"),  // Kokoelma, johon tallennetaan
      {
        nickname,    // Pelaajan antama nimi
        difficulty,  // Valittu vaikeustaso
        time,        // Pelissä kulunut aika
      }
    );
    console.log("✅ Pelitulos tallennettu Firebaseen");  // Onnistumisen lokiviesti
  } catch (error) {
    // Jos jotain menee pieleen, lokitetaan virhe
    console.error("❌ Virhe tallennettaessa tulosta: ", error);
  }
};
