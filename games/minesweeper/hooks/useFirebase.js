// hooks/useFirebase.js
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase/Config";

export const saveMinesweeperResult = async (nickname, difficulty, time) => {
  try {
    await addDoc(collection(db, "MinesweeperResults"), {
      nickname,
      difficulty,
      time,
    });
    console.log("✅ Pelitulos tallennettu Firebaseen");
  } catch (error) {
    console.error("❌ Virhe tallennettaessa tulosta: ", error);
  }
};
