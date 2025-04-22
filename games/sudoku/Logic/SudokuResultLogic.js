// Tuodaan Firebasen tietokantakirjaston funktiot dokumenttien hakuun ja lajitteluun
import { collection, getDocs, query, orderBy } from "firebase/firestore";
// Tuodaan oma tietokantayhteys
import { db } from "../../../firebase/Config";

// Hakee kaikki Sudoku-tulokset Firebasesta, lajittelee ajan mukaan ja muuntaa ajan sekunneiksi
export async function fetchScores() {
  const q = query(
    collection(db, "SudokuGameResults"), 
    orderBy("time") 
  );
  const snap = await getDocs(q); 
  return snap.docs.map(doc => {
    const data = doc.data();
    let timeInSeconds = 0;
    if (data.time) { 
      const [m, s] = data.time.split(":");
      timeInSeconds = parseInt(m) * 60 + parseInt(s);
    }
    return { ...data, timeInSeconds };
  });
}

// Laskee yksittäisen pelaajan sijoituksen annetun vaikeustason tuloslistassa
export function computePlayerRank(scores, difficulty, nickname, timeInSeconds) {
  const list = scores
    .filter(s => s.difficulty === difficulty)                // Suodata tason mukaan
    .sort((a, b) => a.timeInSeconds - b.timeInSeconds);      // Lajittele ajan perusteella
  const idx = list.findIndex(
    s =>
      s.timeInSeconds === timeInSeconds &&                  // Etsii juuri pelanneen pelaajan tulos
      (s.Nickname ?? "") === nickname
  );
  return idx >= 0 ? idx + 1 : null;                         // Palauta sijoitus tai null
}

// Palauttaa annetun vaikeustason top N tulosta nopeimman ajan perusteella
export function getTopScores(scores, difficulty, topN = 10) {
  return scores
    .filter(s => s.difficulty === difficulty)
    .sort((a, b) => a.timeInSeconds - b.timeInSeconds) 
    .slice(0, topN); 
}
