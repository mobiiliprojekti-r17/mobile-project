import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import sudoku from "sudoku";
import styles from "../styles/SudokuStyles";

export default function Sudoku({ route, navigation }) {
  const [board, setBoard] = useState([]);
  const [solution, setSolution] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  const [difficulty, setDifficulty] = useState(route.params?.difficulty);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (board.length === 0) {
      setBoardForDifficulty(difficulty);
    }
  }, [difficulty]);


  const setBoardForDifficulty = (level) => {
    let filledCells;
    switch (level) {
      case "easy":
        filledCells = 80;
        break;
      case "medium":
        filledCells = 40;
        break;
      case "hard":
        filledCells = 30;
        break;
      default:
        filledCells = 40;
    }

    const puzzle = sudoku.makepuzzle();
    const solvedPuzzle = sudoku.solvepuzzle(puzzle);
    const newBoard = [];
    for (let i = 0; i < 9; i++) {
      newBoard.push([]);
      for (let j = 0; j < 9; j++) {
        const num = solvedPuzzle[i * 9 + j] !== null ? solvedPuzzle[i * 9 + j] + 1 : "";
        newBoard[i].push({ value: num.toString(), preFilled: true });
      }
    }

    let cellsToRemove = 81 - filledCells;
    while (cellsToRemove > 0) {
      let row = Math.floor(Math.random() * 9);
      let col = Math.floor(Math.random() * 9);
      if (newBoard[row][col].value !== "") {
        newBoard[row][col].value = "";
        newBoard[row][col].preFilled = false;
        cellsToRemove--;
      }
    }

    setBoard(newBoard);
    setSolution(solvedPuzzle);
    setSelectedCell(null);
    setTimer(0);
    setIsRunning(true);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleNumberPress = (number) => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      const newBoard = board.map((r) => r.map((cell) => ({ ...cell }))); // Syväkopio

      if (!newBoard[row][col].preFilled) {
        newBoard[row][col].value = number.toString(); // Asetetaan numero
        setBoard(newBoard); // Päivitetään peli
      } else {
        Toast.show({
          type: "error",
          text1: "Et voi muokata täytettyä kenttää!",
        });
      }

      setSelectedCell(null); // Nollataan valittu solu
    }
  };

  const handleCellPress = (row, col) => {
    setSelectedCell({ row, col });
  };

  const handleClearPress = () => {
    if (selectedCell) {
      const { row, col } = selectedCell;
      const newBoard = board.map((r) => r.map((cell) => ({ ...cell }))); // Syväkopio
      if (!newBoard[row][col].preFilled) {
        newBoard[row][col].value = "";
      }
      setBoard(newBoard);
      setSelectedCell(null);
    }
  };

  const checkSudoku = () => {
    if (!solution) {
      Toast.show({ type: "error", text1: "Ratkaisua ei löydy!" });
      return;
    }
  
    let isCorrect = true;
    const newBoard = board.map((row, rowIndex) => {
      return row.map((cell, colIndex) => {
        const correctValue = solution[rowIndex * 9 + colIndex] !== null ? 
          (solution[rowIndex * 9 + colIndex] + 1).toString() : "";
  
        if (cell.value !== correctValue) {
          isCorrect = false;
          return { ...cell, isError: true };  // Merkitään virheellinen
        }
        return { ...cell, isError: false }; // Oikeat solut pysyvät normaaleina
      });
    });
  
    setBoard(newBoard); // Päivitetään UI
  
    if (isCorrect) {
      setIsRunning(false);
      Alert.alert("Sudoku ratkaistu!", "Kaikki numerot ovat oikein!", [{ text: "OK" }]);
    } else {
      Alert.alert("Virheitä löytyi!", "Korjaa punaiset ruudut ja yritä uudelleen.", [{ text: "OK" }]);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sudoku</Text>
      <View style={styles.header}>
        <Text style={styles.difficultyText}>Difficulty: {difficulty}</Text>
        <Text style={styles.timerText}>Time: {formatTime(timer)}</Text>
      </View>

      {/* Sudoku-ruudukko */}
      {board.length > 0 &&
        board.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.cell,
                  (Math.floor(rowIndex / 3) + Math.floor(colIndex / 3)) % 2 === 1 && styles.grayCell,
                  rowIndex % 3 === 0 && rowIndex !== 0 && styles.boldTop,
                  colIndex % 3 === 0 && colIndex !== 0 && styles.boldLeft,
                  colIndex === 8 && styles.boldRight,
                  rowIndex === 8 && styles.boldBottom,
                  selectedCell?.row === rowIndex && selectedCell?.col === colIndex && styles.selectedCell,
                  cell.isError && styles.cellError,
                  cell.preFilled && styles.preFilledCell, // Taustan väri valmiiksi täytetyille
                ]}
                onPress={() => handleCellPress(rowIndex, colIndex)}
              >
                <Text
            style={[
              styles.cellText,
              !cell.preFilled && cell.value !== "" && styles.userAddedNumberText,
            ]}
          >
            {cell.value}
          </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
        
      {/* Numeron painikkeet */}
      <View style={styles.numberPad}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
          <Button
            key={number}
            style={styles.numberButton}
            mode="contained"
            onPress={() => handleNumberPress(number)}
          >
            {number}
          </Button>
        ))}
      </View>

      {/* Pelin toiminnot */}
      <Button mode="contained" onPress={checkSudoku}>Tarkista Sudoku</Button>
      <Button mode="contained" onPress={handleClearPress}>Tyhjennä valittu kenttä</Button>
    </View>
  );
}
