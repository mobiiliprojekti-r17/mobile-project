import { useState, useEffect } from "react";

const useTimer = (isRunning = true) => {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const timerInterval = setInterval(() => {
      setTimer((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, [isRunning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const resetTimer = () => setTimer(0);

  return { timer, formatTime, resetTimer };
};

export default useTimer;
