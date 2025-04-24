import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../../firebase/Config";

// Hook, joka hakee Minesweeper‑tulokset Firebasesta
const useScores = () => {
  const [scores, setScores] = useState([]);    // Tallentaa haetut tulokset
  const [loading, setLoading] = useState(true); // Ilmoittaa, ollaanko vielä hakemassa
  const [error, setError] = useState(null);    // Tallentaa mahdollisen virheen

  useEffect(() => {
    // Sisäinen funktio, joka suorittaa kyselyn
    const fetchScores = async () => {
      try {
        // Määritellään kysely: kokoelma "MinesweeperResults", lajiteltuna ajan mukaan
        const scoresQuery = query(
          collection(db, "MinesweeperResults"),
          orderBy("time")
        );
        // Suoritetaan kysely 
        const querySnapshot = await getDocs(scoresQuery);

        // Muodostetaan lista pisteistä, muuntaen ajan sekunneiksi
        const scoresList = querySnapshot.docs.map(doc => {
          const data = doc.data();
          if (data.time) {
            // Aika merkkijonona "m:ss" → sekunteina
            const [minutes, seconds] = data.time.split(":");
            data.timeInSeconds = parseInt(minutes, 10) * 60 + parseInt(seconds, 10);
          } else {
            data.timeInSeconds = 0; // Jos aikaa ei ole, asetetaan nollaksi
          }
          return data;
        });

        setScores(scoresList); // Päivitetään tila haetuilla tuloksilla
      } catch (error) {
        console.error("Virhe tulosten hakemisessa: ", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores(); // Käynnistetään haku heti, kun hook aktivoituu
  }, []); 

  // Palautetaan hookin käyttäjälle tulokset, lataustila ja mahdollinen virhe
  return { scores, loading, error };
};

export default useScores;
