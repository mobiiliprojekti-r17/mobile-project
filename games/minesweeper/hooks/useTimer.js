import { useState, useEffect } from "react";

// Hook, joka hoitaa sekuntikellon toiminnan
const useTimer = (isRunning = true) => {
  // Tilamuuttuja kellon sekunneille
  const [timer, setTimer] = useState(0);

  // Käynnistää tai pysäyttää intervallin isRunning‑tilan mukaan
  useEffect(() => {
    if (!isRunning) return;                     // Jos kello ei saa käynnistyä, ei mennä tästä eteenpäin
    const timerInterval = setInterval(() => {
      setTimer(prev => prev + 1);               // Kasvata laskuria aina yhdellä sekunnilla
    }, 1000);
    return () => clearInterval(timerInterval);   // Siivotaan intervalli, kun hook puretaan tai isRunning muuttuu
  }, [isRunning]);

  // Muotoilee sekuntimäärän tekstiksi "mm:ss"
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);   // Kokonaiset minuutit
    const secs = seconds % 60;                  // Jäljelle jäävät sekunnit
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Nollataan kello takaisin nollaan
  const resetTimer = () => setTimer(0);

  // Palautetaan kellon arvo, formaattifunktio ja nollausfunktio
  return { timer, formatTime, resetTimer };
};

export default useTimer;
