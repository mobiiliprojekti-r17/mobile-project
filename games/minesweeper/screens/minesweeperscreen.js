import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Board from "../components/minesweeperboad"; 
import styles from "../styles/minesweeperStyles"; 
import useTimer from "../hooks/useTimer";
import useMinesweeper from "../hooks/useMinesweeper"; 
import DifficultySelectorModal from "../Modals/difficultyModals"; 
import { saveMinesweeperResult } from "../hooks/useFirebase"; 
import GameHeader from "../components/gameHeader"; 
import InstructionsModal from "../Modals/InstructionsModal";
import GameButtons from "../components/GameButtons"; 
import ResultModal from "../Modals/ResultModal";  

export default function MinesweeperScreen() {
  // Reitiltä saadaan aloitusvaikeustaso ja nickname
  const route = useRoute();
  const navigation = useNavigation();
  const { difficulty: initialDifficulty } = route.params || { difficulty: "EASY" };
  const [nickname, setNickname] = useState("");

  // Ohjaus, näytetäänkö Results‑nappi, modalit ja niiden viestit
  const [showResultButton, setShowResultButton] = useState(false);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [restartModalVisible, setRestartModalVisible] = useState(false);
  const [instructionsVisible, setInstructionsVisible] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  // Pelilogiikka‑hookit: kaikki pelitila, toiminnot ja tilanvaihdot
  const { board, gameOver, win, difficulty, remainingMines, resetGame, revealTile, flagTile, changeDifficulty, revealAllTiles } = useMinesweeper(initialDifficulty);

  // Sekuntikello‑hook käynnissä niin kauan kun peli ei ole ohi eikä voitettu
  const isTimerRunning = !gameOver && !win;
  const { timer, formatTime, resetTimer } = useTimer(isTimerRunning);

  // Otetaan talteen reitiltä nickname
  useEffect(() => {
    if (route.params?.nickname) {
      setNickname(route.params.nickname);
    }
  }, [route.params?.nickname]);

  // Kun vaikeustaso vaihtuu, nollataan peli ja kello
  useEffect(() => {
    resetGame();
    resetTimer();
    setShowResultButton(false);
    setResultModalVisible(false);
  }, [difficulty]);

  // Seurataan win- ja gameOver-tiloja: tallennetaan voitot Firebaseen
  // ja näytetään lopputulos‑modal puolen sekunnin viiveellä
  useEffect(() => {
    if (win) {
      saveMinesweeperResult(nickname, difficulty, formatTime(timer));
      setShowResultButton(true);
      revealAllTiles();               // Paljasta kaikki ruudut voiton jälkeen
      setResultMessage("You win!");
      setTimeout(() => setResultModalVisible(true), 500);
    } else if (gameOver) {
      setResultMessage("You hit a mine!");
      setTimeout(() => setResultModalVisible(true), 500);
      setShowResultButton(false);
    }
  }, [win, gameOver]);

  // Käsittelijä vaikeustason vaihtamiseen Restart‑modalista
  const handleDifficultyChange = (newDifficulty) => {
    changeDifficulty(newDifficulty);
    resetTimer();
    resetGame();
    setShowResultButton(false);
    setResultModalVisible(false);
    setRestartModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minesweeper</Text>
      {/* Ylätunniste: vaikeustaso, aika ja jäljellä olevian miinojen lukumäärä */}
      <GameHeader 
        difficulty={difficulty} 
        timer={timer} 
        remainingMines={remainingMines} 
        formatTime={formatTime} 
      />

      {/* Pelilauta, jossa napautus paljastaa ruutuja tai liputus pitkällä painalluksella */}
      <Board 
        board={board} 
        revealTile={revealTile} 
        flagTile={flagTile} 
        difficulty={difficulty} 
      />

      {/* Toimintonapit: Info, Restart, Home ja voiton jälkeen Results */}
      <GameButtons
        onInfoPress={() => setInstructionsVisible(true)}
        onRestartPress={() => setRestartModalVisible(true)}
        onHomePress={() => navigation.navigate("Home")}
        onResultsPress={() =>
          navigation.navigate("MinesweeperResults", {
            nickname,
            time: timer,
            difficulty,
          })
        }
        showResults={showResultButton}
      />

      {/* Lopputulos‑modal: voitto tai häviö */}
      <ResultModal
        visible={resultModalVisible}
        message={resultMessage}
        onClose={() => setResultModalVisible(false)}
      />

      {/* Modal vaikeustason valintaan */}
      <DifficultySelectorModal
        visible={restartModalVisible}
        onSelect={handleDifficultyChange}
        onCancel={() => setRestartModalVisible(false)}
      />

      {/* Ohjemodal */}
      <InstructionsModal 
        visible={instructionsVisible} 
        onClose={() => setInstructionsVisible(false)} 
      />
    </View>
  );
}
