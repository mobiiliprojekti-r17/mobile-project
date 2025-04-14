import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Board from "../components/minesweeperboad";
import { generateBoard } from "../components/generateboard";
import { styles } from "../styles/minesweeperStyles";
import { db } from "../../../firebase/Config";
import { collection, addDoc } from "firebase/firestore";

const DIFFICULTY_LEVELS = {
  easy: { size: 8, mines: 1 },
  medium: { size: 10, mines: 20 },
  hard: { size: 12, mines: 30 },
};

const MinesweeperScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { difficulty: initialDifficulty } = route.params || { difficulty: "easy" };

  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [timer, setTimer] = useState(0);
  const [showResultButton, setShowResultButton] = useState(false);
  const [Nickname, setNickname] = useState("");
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [restartModalVisible, setRestartModalVisible] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [remainingMines, setRemainingMines] = useState(DIFFICULTY_LEVELS[difficulty].mines);

  useEffect(() => {
    if (route.params?.nickname) {
      setNickname(route.params.nickname);
    }
  }, [route.params?.nickname]);

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    let timerInterval;
    if (!gameOver && !win) {
      timerInterval = setInterval(() => setTimer((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timerInterval);
  }, [gameOver, win]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const resetGame = () => {
    const { size, mines } = DIFFICULTY_LEVELS[difficulty];
    setRemainingMines(mines);
    setBoard(generateBoard(size, mines));
    setGameOver(false);
    setWin(false);
    setTimer(0);
    setShowResultButton(false);
    setResultModalVisible(false);
    setRestartModalVisible(false);
  };

  const saveGameResult = async () => {
    try {
      await addDoc(collection(db, "MinesweeperResults"), {
        Nickname,
        difficulty,
        time: formatTime(timer),
      });
      console.log("✅ Pelitulos tallennettu Firebaseen");
    } catch (error) {
      console.error("❌ Virhe tallennettaessa tulosta: ", error);
    }
  };

  const revealAllTiles = () => {
    setBoard((prev) =>
      prev.map((row) => row.map((cell) => ({ ...cell, revealed: true })))
    );
  };

  const revealTile = (row, col) => {
    if (gameOver || win) return;
    board[row][col].exploded = true;
    if (board[row][col].mine) {
      revealAllMines();
      setGameOver(true);
      setResultMessage("You hit a mine!");
      setShowResultButton(true);
      setTimeout(() => setResultModalVisible(true), 500);
      return;
    }

    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    revealCells(newBoard, row, col);
    setBoard(newBoard);

    if (checkWin(newBoard)) {
      setWin(true);
      saveGameResult();
      setShowResultButton(true);
      revealAllTiles();
      setResultMessage("You win!");
      setTimeout(() => setResultModalVisible(true), 500);
    }
  };

  const revealCells = (board, row, col) => {
    if (board[row][col].revealed || board[row][col].flagged) return;
    board[row][col].revealed = true;
    if (board[row][col].number === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr,
            nc = col + dc;
          if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) {
            revealCells(board, nr, nc);
          }
        }
      }
    }
  };

  const revealAllMines = () => {
    setBoard((prev) =>
      prev.map((row) =>
        row.map((cell) => (cell.mine ? { ...cell, revealed: true } : cell))
      )
    );
  };

  const checkWin = (board) => {
    return board.every((row) =>
      row.every((cell) => cell.mine || cell.revealed)
    );
  };

  const flagTile = (row, col) => {
    if (gameOver || win) return;
    if (board[row][col].revealed) return;
    
    const targetCell = board[row][col];
    if (targetCell.flagged) {
      setRemainingMines((prev) => prev + 1);
    } else {
      setRemainingMines((prev) => prev - 1);
    }

    setBoard((prevBoard) =>
      prevBoard.map((r, ri) =>
        r.map((cell, ci) =>
          ri === row && ci === col ? { ...cell, flagged: !cell.flagged } : cell
        )
      )
    );
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    resetGame();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minesweeper</Text>

      <View style={styles.header}>
        <Text style={styles.difficultyText}>Difficulty: {difficulty.toUpperCase()}</Text>
        <Text style={styles.timerText}>Time: {formatTime(timer)}</Text>
        <Text style={styles.mineCountText}>Mines left: {remainingMines}</Text>
      </View>

      <Board board={board} revealTile={revealTile} flagTile={flagTile} difficulty={difficulty} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => setRestartModalVisible(true)}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>

        {showResultButton && (
          <TouchableOpacity
            style={styles.resultButton}
            onPress={() =>
              navigation.navigate("MinesweeperResults", {
                Nickname,
                time: timer,
                difficulty,
              })
            }
          >
            <Text style={styles.resultButtonText}>Results</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal for Game Result */}
      <Modal transparent animationType="fade" visible={resultModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{resultMessage}</Text>
            <TouchableOpacity onPress={() => setResultModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Restart Difficulty Selection */}
      <Modal transparent animationType="fade" visible={restartModalVisible}>
        <View style={styles.modalOverlay}>
          <View style={styles.difficultyModalContent}>
            <Text style={styles.modalText}>Choose difficulty</Text>
            {["easy", "medium", "hard"].map((level) => (
              <TouchableOpacity
                key={level}
                onPress={() => handleDifficultyChange(level)}
                style={styles.difficultyModalButton}
              >
                <Text style={styles.modalButtonText}>{level}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setRestartModalVisible(false)} style={styles.difficultyModalButton}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MinesweeperScreen;
