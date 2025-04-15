import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Board from "../components/minesweeperboad";
import { styles } from "../styles/minesweeperStyles";
import Icon from "react-native-vector-icons/Feather";
import InstructionsModal from "../components/InstructionsModal";
import useTimer from "../hooks/useTimer";
import useMinesweeper from "../hooks/useMinesweeper";
import DifficultySelectorModal from "../components/difficultyModals";
import { saveMinesweeperResult } from "../hooks/useFirebase";
import GameHeader from "../components/gameHeader";

const MinesweeperScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { difficulty: initialDifficulty } = route.params || { difficulty: "easy" };
  const [showResultButton, setShowResultButton] = useState(false);
  const [nickname, setNickname] = useState("");
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [restartModalVisible, setRestartModalVisible] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [instructionsVisible, setInstructionsVisible] = useState(true);
  const { board, gameOver, win, difficulty, remainingMines, resetGame, revealTile, flagTile, changeDifficulty, revealAllTiles  } = useMinesweeper(initialDifficulty);
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
    }
  }, [win]);

  useEffect(() => {
    if (gameOver && !win) {
      setResultMessage("You hit a bomb!");
      setTimeout(() => setResultModalVisible(true), 500);
      setShowResultButton(true);
    }
  }, [gameOver, win]);

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
      <GameHeader 
        difficulty={difficulty} 
        timer={timer} 
        remainingMines={remainingMines} 
        formatTime={formatTime} 
      />

      <Board board={board} revealTile={revealTile} flagTile={flagTile} difficulty={difficulty} />

      <View style={styles.buttonContainer}>
        {/* Restart- ja Home-napit ovat aina näkyvillä */}
        <TouchableOpacity style={styles.button} onPress={() => setRestartModalVisible(true)}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Icon name="home" size={24} color="#fff" />
        </TouchableOpacity>
        
        {/* Result-nappi näytetään vain voiton tai häviön jälkeen */}
        {showResultButton && (
          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate("MinesweeperResults", {
                nickname,
                time: timer,
                difficulty,})
               }>
            <Text style={styles.buttonText}>Results</Text>
          </TouchableOpacity>
        )}
      </View>

      <Modal transparent animationType="fade" visible={resultModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{resultMessage}</Text>
            <TouchableOpacity 
              onPress={() => setResultModalVisible(false)} 
              style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <DifficultySelectorModal
        visible={restartModalVisible}
        onSelect={handleDifficultyChange}
        onCancel={() => setRestartModalVisible(false)}
      />
    </View>
  );
};

export default MinesweeperScreen;
