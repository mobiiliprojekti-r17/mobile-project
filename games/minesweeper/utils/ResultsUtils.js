import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase/Config";

// Hakee kaikki Minesweeper-pelitulokset Firebasesta ajan mukaan lajittelemalla
export async function fetchScores() {
  // Määritellään kysely: kokoelma ja lajittelu kentän "time" mukaan
  const q = query(
    collection(db, "MinesweeperResults"),
    orderBy("time")
  );
  // Suoritetaan kysely 
  const snap = await getDocs(q);
  // Muodostetaan lista tuloksista ja muunnetaan aika sekunneiksi
  return snap.docs.map(doc => {
    const data = doc.data();
    let timeInSeconds = 0;
    if (data.time) {
      // Jos "time" on merkkijonona "mm:ss", pilkotaan minuutit ja sekunnit
      const [m, s] = data.time.split(":");
      timeInSeconds = parseInt(m, 10) * 60 + parseInt(s, 10);
    }
    return { ...data, timeInSeconds };
  });
}

// Laskee pelaajan sijoituksen tietyn vaikeustason tuloslistassa
export function computePlayerRank(scores, difficulty, nickname, timeInSeconds) {
  // Suodatetaan vain halutun vaikeustason tulokset ja lajitellaan pienimmästä ajasta alkaen
  const list = scores
    .filter(s => s.difficulty === difficulty)
    .sort((a, b) => a.timeInSeconds - b.timeInSeconds);

  // Etsitään juuri pelatun pelaajan tulos listasta nimellä ja ajalla
  const idx = list.findIndex(
    s => s.nickname === nickname && s.timeInSeconds === timeInSeconds
  );
  // Palautetaan sijoitus (+1, koska indeksi alkaa 0:sta), tai null jos ei löydy
  return idx >= 0 ? idx + 1 : null;
}

// Palauttaa top 10 nopeinta aikaa tietylle vaikeustasolle
export function getTopScores(scores, difficulty, topN = 10) {
  return scores
    .filter(s => s.difficulty === difficulty)
    .sort((a, b) => a.timeInSeconds - b.timeInSeconds) 
    .slice(0, topN); 
}
