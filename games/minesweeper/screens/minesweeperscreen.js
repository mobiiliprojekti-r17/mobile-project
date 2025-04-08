import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, Modal } from "react-native";
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
  const [Nickname, setNickname] = useState('');
  const [showModal, setShowModal] = useState(false);

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
      timerInterval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
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
    setBoard(generateBoard(size, mines));
    setGameOver(false);
    setWin(false);
    setTimer(0);
    setShowResultButton(false);
    setShowModal(false);
  };

  const saveGameResult = async () => {
    try {
      const gameResultsRef = collection(db, "MinesweeperResults");
      await addDoc(gameResultsRef, {
        Nickname: Nickname,
        difficulty: difficulty,
        time: formatTime(timer),
      });
      console.log("Pelitulos tallennettu Firebaseen");
    } catch (error) {
      console.error("Virhe tallennettaessa tulosta: ", error);
    }
  };

  const revealAllTiles = () => {
    setBoard(prevBoard =>
      prevBoard.map(row =>
        row.map(cell => ({
          ...cell,
          revealed: true
        }))
      )
    );
  };

  const revealAllMines = () => {
    setBoard(prevBoard =>
      prevBoard.map(row =>
        row.map(cell => (cell.mine ? { ...cell, revealed: true } : cell))
      )
    );
  };

  const revealTile = (row, col) => {
    if (gameOver || win) return;

    if (board[row][col].mine) {
      revealAllMines();
      setGameOver(true);
      setTimeout(() => setShowModal(true), 1000);
      return;
    }

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    revealCells(newBoard, row, col);
    setBoard(newBoard);

    if (checkWin(newBoard)) {
      setWin(true);
      saveGameResult();
      setShowResultButton(true);
      revealAllTiles();
      setTimeout(() => setShowModal(true), 50);
    }
  };

  const revealCells = (board, row, col) => {
    if (board[row][col].revealed || board[row][col].flagged) return;
    board[row][col].revealed = true;

    if (board[row][col].number === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr, nc = col + dc;
          if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) {
            revealCells(board, nr, nc);
          }
        }
      }
    }
  };

  const checkWin = (board) => {
    return board.every(row =>
      row.every(cell => (cell.mine || cell.revealed))
    );
  };

  const flagTile = (row, col) => {
    if (gameOver || win) return;
    let newBoard = board.map((r, ri) => r.map((cell, ci) =>
      ri === row && ci === col ? { ...cell, flagged: !cell.flagged } : cell
    ));
    setBoard(newBoard);
  };

  const showDifficultyAlert = () => {
    Alert.alert(
      "Choose difficulty",
      "",
      [
        {
          text: "Easy",
          onPress: () => handleDifficultyChange("easy"),
        },
        {
          text: "Medium",
          onPress: () => handleDifficultyChange("medium"),
        },
        {
          text: "Hard",
          onPress: () => handleDifficultyChange("hard"),
        },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: true }
    );
  };

  const handleDifficultyChange = (newDifficulty) => {
    setShowResultButton(false);
    setGameOver(false);
    setWin(false);
    setTimer(0);
    setShowModal(false);
    if (newDifficulty === difficulty) {
      resetGame();
    } else {
      setDifficulty(newDifficulty);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Minesweeper</Text>

      <View style={styles.header}>
        <Text style={styles.difficultyText}>Difficulty: {difficulty.toUpperCase()}</Text>
        <Text style={styles.timerText}>Time: {formatTime(timer)}</Text>
      </View>

      <Board board={board} revealTile={revealTile} flagTile={flagTile} difficulty={difficulty} />

      {/* Result Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => {}}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {win ? "🎉 You Win!" : "You hit the mine!💥"}
            </Text>
            <TouchableOpacity style={styles.modalButton} onPress={() => setShowModal(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={showDifficultyAlert}>
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
                Nickname: Nickname,
                time: timer,
                difficulty: difficulty,
              })
            }
          >
            <Text style={styles.resultButtonText}>Results</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default MinesweeperScreen;
