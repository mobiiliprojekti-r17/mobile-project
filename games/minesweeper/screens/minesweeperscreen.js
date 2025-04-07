import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
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
  const { difficulty } = route.params || { difficulty: "easy" };
  
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [timer, setTimer] = useState(0);
  const [Nickname, setNickname] = useState('');

  useEffect(() => {
    if (route.params?.nickname) {
      setNickname(route.params.nickname);
    }
  }, [route.params?.nickname]);

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    let timer;
    if (!gameOver && !win) {
      timer = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
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
  };
  const formattedTime = formatTime(timer); // Aika muotoillaan "mm:ss"

  const saveGameResult = async () => {
    try {
      const gameResultsRef = collection(db, "MinesweeperResults");
      await addDoc(gameResultsRef, {
        Nickname: Nickname,
        difficulty: difficulty,
        time: formattedTime,
      });
      console.log("Pelitulos tallennettu Firebaseen");
    } catch (error) {
      console.error("Virhe tallennettaessa tulosta: ", error);
    }

    return formattedTime;
  };

  const revealTile = (row, col) => {
    if (gameOver || win) return;
    if (board[row][col].mine) {
      revealAllMines();
      setGameOver(true);
      return;
    }

    const newBoard = board.map(row => row.map(cell => ({ ...cell })));
    revealCells(newBoard, row, col);
    setBoard(newBoard);
    
    if (checkWin(newBoard)) {
      setWin(true);

      Alert.alert(
        "Voitto! 🎉",
        "Haluatko nähdä tulokset?",
        [
          {
            text: "Peruuta",
            style: "cancel",
          },
          {
            text: "Result",
            onPress: async () => {
            saveGameResult();
              navigation.navigate("MinesweeperResults", {
                Nickname: Nickname,
                time: timer,
                difficulty: difficulty,
              });
            },
          },
        ],
        { cancelable: false }
      );
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

  const revealAllMines = () => {
    setBoard(prevBoard =>
      prevBoard.map(row =>
        row.map(cell => (cell.mine ? { ...cell, revealed: true } : cell))
      )
    );
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

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vaikeustaso: {difficulty.toUpperCase()}</Text>
      <Text style={styles.timer}>
        <Text style={styles.timerText}>Time: {formatTime(timer)}</Text>
      </Text>

      {gameOver && !win && <Text style={styles.gameOverText}>Hävisit! 💥</Text>}
      {win && <Text style={styles.gameOverText}>Voitit! 🎉</Text>}

      <Board board={board} revealTile={revealTile} flagTile={flagTile} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={resetGame}>
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MinesweeperScreen;
