import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, Pressable } from "react-native";
import { Button } from "react-native-paper";
import Toast from "react-native-toast-message";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import sudoku from "sudoku";
import styles from "../styles/SudokuStyles";
import { db, collection, addDoc } from "../../../firebase/Config";

export default function Sudoku({ route, navigation }) {
  const [board, setBoard] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [noteMode, setNoteMode] = useState(false);
  const [Nickname, setNickname] = useState("");
  const [difficulty, setDifficulty] = useState(route.params?.difficulty);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  useEffect(() => {
    if (route.params?.nickname) {
      setNickname(route.params.nickname);
    }
  }, [route.params?.nickname]);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => setTimer(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    setBoardForDifficulty(difficulty);
  }, [difficulty]);

  const setBoardForDifficulty = level => {
    const filledCells = level === "easy" ? 60 : level === "hard" ? 30 : 40;
    const solved = sudoku.solvepuzzle(sudoku.makepuzzle());
    const newBoard = Array.from({ length: 9 }, (_, i) =>
      Array.from({ length: 9 }, (_, j) => ({
        value: solved[i*9+j] != null ? String(solved[i*9+j] + 1) : "",
        preFilled: true,
        notes: [],
        isError: false,
      }))
    );
    let toRemove = 81 - filledCells;
    while (toRemove > 0) {
      const r = Math.floor(Math.random() * 9);
      const c = Math.floor(Math.random() * 9);
      if (newBoard[r][c].value) {
        newBoard[r][c].value = "";
        newBoard[r][c].preFilled = false;
        toRemove--;
      }
    }
    setBoard(newBoard);
    setSelectedCell(null);
    setTimer(0);
    setIsRunning(true);
  };

  const formatTime = sec =>
    `${Math.floor(sec / 60)}:${sec % 60 < 10 ? "0" : ""}${sec % 60}`;

 const handleNumberPress = num => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const copy = board.map(r => r.map(c => ({ ...c, isError: false })));

    if (!copy[row][col].preFilled) {
      if (noteMode) {
        // Note-modessa lisätään/poistetaan vain valitun solun notes
        const notes = copy[row][col].notes || [];
        copy[row][col].notes = notes.includes(num)
          ? notes.filter(n => n !== num)
          : [...notes, num];
      } else {
        // Varsinaisessa numeromoodissa
        copy[row][col].value = String(num);
        copy[row][col].notes = [];

        // POISTA saman numeron muistiinpanot muista soluista
        // 1) RIVI
        for (let j = 0; j < 9; j++) {
          if (j !== col && !copy[row][j].preFilled) {
            copy[row][j].notes = (copy[row][j].notes || []).filter(n => n !== num);
          }
        }
        // 2) SARAKE
        for (let i = 0; i < 9; i++) {
          if (i !== row && !copy[i][col].preFilled) {
            copy[i][col].notes = (copy[i][col].notes || []).filter(n => n !== num);
          }
        }
        // 3) 3×3‑LOHKO
        const bi = Math.floor(row / 3) * 3;
        const bj = Math.floor(col / 3) * 3;
        for (let di = 0; di < 3; di++) {
          for (let dj = 0; dj < 3; dj++) {
            const i = bi + di, j = bj + dj;
            if ((i !== row || j !== col) && !copy[i][j].preFilled) {
              copy[i][j].notes = (copy[i][j].notes || []).filter(n => n !== num);
            }
          }
        }
      }

      setBoard(copy);
    } else {
      Toast.show({ type: "error", text1: "You cannot edit a filled cell!" });
    }
  };


  const handleClearPress = () => {
    if (!selectedCell) return;
    const { row, col } = selectedCell;
    const copy = board.map(r => r.map(c => ({ ...c, isError: false })));
    if (!copy[row][col].preFilled) {
      if (noteMode) {
        copy[row][col].notes = [];
      } else {
        copy[row][col].value = "";
        copy[row][col].notes = [];
      }
      setBoard(copy);
    }
  };

  const handleCellPress = (row, col) => {
    setSelectedCell({ row, col });
  };

  const checkSudoku = async () => {
    setSelectedCell(null);
    const errors = Array.from({ length: 9 }, () =>
      Array(9).fill(false)
    );
    let hasError = false;
    // mark empty user cells
    board.forEach((row, i) =>
      row.forEach((cell, j) => {
        if (!cell.value && !cell.preFilled) {
          errors[i][j] = true;
          hasError = true;
        }
      })
    );
    // mark duplicates in rows/cols/blocks
    const markDuplicates = positions => {
      const map = {};
      positions.forEach(([i, j]) => {
        const cell = board[i][j];
        const val = cell.value;
        if (!val) return;
        if (map[val]) {
          const [pi, pj] = map[val];
          if (!board[pi][pj].preFilled) {
            errors[pi][pj] = true;
            hasError = true;
          }
          if (!cell.preFilled) {
            errors[i][j] = true;
            hasError = true;
          }
        } else {
          map[val] = [i, j];
        }
      });
    };
    for (let i = 0; i < 9; i++) {
      markDuplicates(Array.from({ length: 9 }, (_, j) => [i, j]));
      markDuplicates(Array.from({ length: 9 }, (_, j) => [j, i]));
    }
    for (let bi = 0; bi < 3; bi++) {
      for (let bj = 0; bj < 3; bj++) {
        const block = [];
        for (let di = 0; di < 3; di++) {
          for (let dj = 0; dj < 3; dj++) {
            block.push([bi * 3 + di, bj * 3 + dj]);
          }
        }
        markDuplicates(block);
      }
    }
    if (hasError) {
      setBoard(
        board.map((row, i) =>
          row.map((cell, j) => ({ ...cell, isError: errors[i][j] }))
        )
      );
      setModalMessage("Fix the blue boxes and try again.");
      setShowErrorModal(true);
      return;
    }
    setIsRunning(false);
    const timeStr = formatTime(timer);
    try {
      await addDoc(collection(db, "SudokuGameResults"), {
        Nickname,
        difficulty,
        time: timeStr,
      });
    } catch {}
    navigation.replace("SudokuResult", {
      time: timer,
      Nickname,
      difficulty,
    });
  };

  const restart = () => setShowDifficultyModal(true);

  const onSelectDifficulty = level => {
    setShowDifficultyModal(false);
    setBoardForDifficulty(level);
    setDifficulty(level);
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.difficultyText}>Difficulty: {difficulty}</Text>
        <Text style={styles.timerText}>Time: {formatTime(timer)}</Text>
      </View>

      {/* Sudoku Grid */}
      {board.map((rowArr, ri) => (
        <View key={ri} style={styles.row}>
          {rowArr.map((cell, ci) => (
            <TouchableOpacity
              key={ci}
              style={[
                styles.cell,
                (Math.floor(ri / 3) + Math.floor(ci / 3)) % 2 === 1 &&
                  styles.blueCell,
                ri % 3 === 0 && ri !== 0 && styles.boldTop,
                ci % 3 === 0 && ci !== 0 && styles.boldLeft,
                ci === 8 && styles.boldRight,
                ri === 8 && styles.boldBottom,
                cell.isError && styles.cellError,
                selectedCell?.row === ri &&
                  selectedCell?.col === ci &&
                  styles.selectedCell,
                cell.preFilled && styles.preFilledCell,
              ]}
              onPress={() => handleCellPress(ri, ci)}
            >
              {cell.value ? (
                <Text
                  style={[
                    styles.cellText,
                    !cell.preFilled && styles.userAddedNumberText,
                  ]}
                >
                  {cell.value}
                </Text>
              ) : (
                <View
                  style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {Array.from({ length: 9 }, (_, i) => i + 1).map(n => (
                    <Text
                      key={n}
                      style={{
                        fontSize: 8,
                        width: 12,
                        textAlign: "center",
                        color: cell.notes.includes(n) ? "#000" : "transparent",
                      }}
                    >
                      {n}
                    </Text>
                  ))}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}

      {/* Number Pad */}
      <View style={styles.numberPadBox}>
        <View style={styles.numberPad}>
          {Array.from({ length: 9 }, (_, idx) => idx + 1).map(n => {
            // Count usage of n
            const usedCount = board
              .flat()
              .filter(cell => cell.value === String(n)).length;
            const usedUp = usedCount >= 9;
            return (
              <Button
                key={n}
                mode="contained"
                disabled={usedUp}
                style={[
                  styles.numberButton,
                  usedUp && styles.numberButtonDisabled,
                ]}
                labelStyle={styles.numberButtonText}
                onPress={() => handleNumberPress(n)}
              >
                {n}
              </Button>
            );
          })}

          <Button
            style={styles.clearButton}
            labelStyle={styles.numberButtonText}
            textColor="black"
            onPress={handleClearPress}
          >
            <MaterialCommunityIcons
              name="delete"
              size={22}
              color="black"
            />
          </Button>

          <Button
            style={styles.CheckButton}
            labelStyle={styles.numberButtonText}
            textColor="black"
            onPress={checkSudoku}
          >
            Check Sudoku
          </Button>

          <TouchableOpacity style={styles.InfoButton} onPress={() => setShowInstructionsModal(true)}>
<MaterialCommunityIcons name="information" size={24} color="black" />
</TouchableOpacity>
          <Button
            mode={noteMode ? "contained" : "outlined"}
            style={[
              styles.ModeButton,
              noteMode && styles.ModeButtonActive,
            ]}
            labelStyle={
              noteMode
                ? styles.ModeButtonTextActive
                : styles.ModeButtonText
            }
            onPress={() => setNoteMode(!noteMode)}
          >
            {noteMode ? "Note Mode" : "Value Mode"}
          </Button>
        </View>
      </View>

      {/* Controls */}
      <View style={styles.ButtonContainer}>
        <TouchableOpacity
          style={styles.Homebutton}
          onPress={() => navigation.navigate("Home")}
        >
          <MaterialCommunityIcons
            name="home"
            size={25}
            color="#fff"
          />
          <Text style={styles.HomebuttonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.Restartbutton}
          onPress={restart}
        >
          <MaterialCommunityIcons
            name="restart"
            size={25}
            color="#fff"
          />
          <Text style={styles.RestartbuttonText}>Restart</Text>
        </TouchableOpacity>
      </View>

      {/* Instruction Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={showInstructionsModal}
        onRequestClose={() => setShowInstructionsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Instructions</Text>
            <Text style={styles.ModalInfoText}>
            Value Mode: Tap a cell and then a number to enter your answer</Text>
            <Text style={styles.ModalInfoText}>
              Note Mode: Add or delete small notes in a cell</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setShowInstructionsModal(false)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Error Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={showErrorModal}
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setShowErrorModal(false)}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Difficulty Modal */}
      <Modal
        animationType="fade"
        transparent
        visible={showDifficultyModal}
        onRequestClose={() => setShowDifficultyModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Difficulty</Text>
            {["easy", "medium", "hard"].map(level => (
              <Pressable
                key={level}
                style={[styles.button, styles.modalOption]}
                onPress={() => onSelectDifficulty(level)}
              >
                <Text style={styles.textStyle}>
                  {level.toUpperCase()}
                </Text>
              </Pressable>
            ))}
                  <Pressable
        style={[styles.button, styles.buttonClose, { marginTop: 8 }]}
        onPress={() => setShowDifficultyModal(false)}
      >
        <Text style={styles.textStyle}>Cancel</Text>
      </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

