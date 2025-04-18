import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase/Config";

export async function fetchScores() {
  const q = query(collection(db, "SudokuGameResults"), orderBy("time"));
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

export function computePlayerRank(scores, difficulty, nickname, timeInSeconds) {
  const list = scores
    .filter(s => s.difficulty === difficulty)
    .sort((a, b) => a.timeInSeconds - b.timeInSeconds);
  const idx = list.findIndex(
    s => s.timeInSeconds === timeInSeconds && (s.Nickname ?? "") === nickname
  );
  return idx >= 0 ? idx + 1 : null;
}

export function getTopScores(scores, difficulty, topN = 10) {
  return (scores
    .filter(s => s.difficulty === difficulty)
    .sort((a, b) => a.timeInSeconds - b.timeInSeconds)
    .slice(0, topN));
}
