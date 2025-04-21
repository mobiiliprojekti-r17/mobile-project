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
import { useFonts, Bungee_400Regular } from "@expo-google-fonts/bungee";

const MinesweeperScreen = () => {
  const [fontsLoaded] = useFonts({
    Bungee_400Regular,
  });

  const route = useRoute();
  const navigation = useNavigation();
  const { difficulty: initialDifficulty } = route.params || { difficulty: "EASY" };
  const [showResultButton, setShowResultButton] = useState(false);
  const [nickname, setNickname] = useState("");
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [restartModalVisible, setRestartModalVisible] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [instructionsVisible, setInstructionsVisible] = useState(false);
  const { board, gameOver, win, difficulty, remainingMines, resetGame, revealTile, flagTile, changeDifficulty, revealAllTiles, } = useMinesweeper(initialDifficulty);
  const isTimerRunning = !gameOver && !win;
  const { timer, formatTime, resetTimer } = useTimer(isTimerRunning);

  useEffect(() => {
    if (route.params?.nickname) {
      setNickname(route.params.nickname);
    }
  }, [route.params?.nickname]);

  useEffect(() => {
    resetGame();
    resetTimer();
    setShowResultButton(false);
    setResultModalVisible(false);
  }, [difficulty]);

  useEffect(() => {
    if (win) {
      saveMinesweeperResult(nickname, difficulty, formatTime(timer));
      setShowResultButton(true);
      revealAllTiles();
      setResultMessage("You win!");
      setTimeout(() => setResultModalVisible(true), 500);
    } else if (gameOver) {
      setResultMessage("You hit a mine!");
      setTimeout(() => setResultModalVisible(true), 500);
      setShowResultButton(false);
    }
  }, [win, gameOver]);
  
  const handleDifficultyChange = (newDifficulty) => {
    changeDifficulty(newDifficulty);
    resetTimer();
    resetGame();
    setShowResultButton(false);
    setResultModalVisible(false);
    setRestartModalVisible(false);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minesweeper</Text>
      
      <GameHeader 
        difficulty={difficulty} 
        timer={timer} 
        remainingMines={remainingMines} 
        formatTime={formatTime} 
      />

      <Board board={board} revealTile={revealTile} flagTile={flagTile} difficulty={difficulty} />

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

      <ResultModal
        visible={resultModalVisible}
        message={resultMessage}
        onClose={() => setResultModalVisible(false)}
      />

      <DifficultySelectorModal
        visible={restartModalVisible}
        onSelect={handleDifficultyChange}
        onCancel={() => setRestartModalVisible(false)}
      />

      <InstructionsModal 
        visible={instructionsVisible} 
        onClose={() => setInstructionsVisible(false)} 
      />
    </View>
  );
};

export default MinesweeperScreen;