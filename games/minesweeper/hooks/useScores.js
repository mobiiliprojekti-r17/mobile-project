import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase/Config";

const useScores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresQuery = query(collection(db, "MinesweeperResults"), orderBy("time"));
        const querySnapshot = await getDocs(scoresQuery);
        const scoresList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          if (data.time) {
            const timeParts = data.time.split(":");
            data.timeInSeconds = parseInt(timeParts[0], 10) * 60 + parseInt(timeParts[1], 10);
          } else {
            data.timeInSeconds = 0;
          }
          return data;
        });
        setScores(scoresList);
      } catch (error) {
        console.error("Virhe tulosten hakemisessa: ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  return { scores, loading, error };
};

export default useScores;
