import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { useFonts, RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';
import styles from "../styles/SudokuStyles";
import { db, collection, addDoc } from "../../../firebase/Config";
import { InstructionsModal, ErrorModal, DifficultyModal } from "../components/Sudoku/Modals";
import Board from "../components/Sudoku/Board";
import NumberPad from "../components/Sudoku/NumberPad";
import Controls from "../components/Sudoku/Controls";
import { generateBoard, formatTime, validateBoard, handleNumberPress as logicHandleNumberPress, handleClearPress as logicHandleClearPress } from "../Logic/SudokuLogic";

export default function Sudoku({ route, navigation }) {
  const [fontsLoaded] = useFonts({ RobotoMono_400Regular });
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
    let iv;
    if (isRunning) iv = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [isRunning]);

  useEffect(() => {
    setBoard(generateBoard(difficulty));
    setSelectedCell(null);
    setTimer(0);
    setIsRunning(true);
  }, [difficulty]);


  const onCellPress = (row, col) => {
    setSelectedCell({ row, col });
  };

  const onNumberPress = num => {
    if (!selectedCell) return;
    const newBoard = logicHandleNumberPress(board, selectedCell, noteMode, num);
    setBoard(newBoard);
  };

  const onClearPress = () => {
    if (!selectedCell) return;
    const newBoard = logicHandleClearPress(board, selectedCell, noteMode);
    setBoard(newBoard);
  };

  const onCheck = async () => {
    setSelectedCell(null);
    const { errors, hasError } = validateBoard(board);
    if (hasError) {
      const errored = board.map((row, i) =>
        row.map((cell, j) => ({ ...cell, isError: errors[i][j] }))
      );
      setBoard(errored);
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
        time: timeStr
      });
    } catch {}
    navigation.replace("SudokuResult", {
      time: timer,
      Nickname,
      difficulty
    });
  };

  const onRestart = () => setShowDifficultyModal(true);

  const onSelectDifficulty = level => {
    setShowDifficultyModal(false);
  
    const newBoard = generateBoard(level);
    setBoard(newBoard);
    setSelectedCell(null);
 
    setTimer(0);
    setIsRunning(true);
  
    setDifficulty(level);
  };
  
  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.difficultyText}>Difficulty: {difficulty}</Text>
        <Text style={styles.timerText}>Time: {formatTime(timer)}</Text>
      </View>

      <Board
        board={board}
        selectedCell={selectedCell}
        onCellPress={onCellPress}
      />

      <NumberPad
        board={board}
        onNumberPress={onNumberPress}
        onClear={onClearPress}
        onCheck={onCheck}
        noteMode={noteMode}
        onToggleNote={() => setNoteMode(m => !m)}
        onShowInfo={() => setShowInstructionsModal(true)}
      />

      <Controls onHome={() => navigation.navigate("Home")} onRestart={onRestart} />

      <InstructionsModal visible={showInstructionsModal} onClose={() => setShowInstructionsModal(false)} />
      <ErrorModal visible={showErrorModal} message={modalMessage} onClose={() => setShowErrorModal(false)} />
      <DifficultyModal
        visible={showDifficultyModal}
        onSelectDifficulty={onSelectDifficulty}
        onClose={() => setShowDifficultyModal(false)}
      />
    </View>
  );
}
