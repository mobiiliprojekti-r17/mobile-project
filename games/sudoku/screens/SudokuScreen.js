import React, { useState, useEffect } from "react";  
import { View, Text } from "react-native"; 
import styles from "../styles/SudokuStyles"; 
import { db, collection, addDoc } from "../../../firebase/Config"; 
import { InstructionsModal, ErrorModal, DifficultyModal } from "../components/Sudoku/Modals"; 
import Board from "../components/Sudoku/Board";  
import NumberPad from "../components/Sudoku/NumberPad"; 
import Controls from "../components/Sudoku/Controls";  
import { generateBoard, formatTime, validateBoard, handleNumberPress as logicHandleNumberPress, handleClearPress as logicHandleClearPress } from "../Logic/SudokuLogic";  

export default function Sudoku({ route, navigation }) {
  const [board, setBoard] = useState([]);                            // 9×9‑ruudukon tila
  const [selectedCell, setSelectedCell] = useState(null);            // Valittu solu
  const [noteMode, setNoteMode] = useState(false);                   // Muistiinpanotila päällä/pois
  const [Nickname, setNickname] = useState("");                      // Pelaajan lempinimi
  const [difficulty, setDifficulty] = useState(route.params?.difficulty); // Vaikeustaso parametreista
  const [timer, setTimer] = useState(0);                             // Sekuntikello
  const [isRunning, setIsRunning] = useState(false);                 // Onko kello käynnissä
  const [showErrorModal, setShowErrorModal] = useState(false);       // Virhe‑modal 
  const [showDifficultyModal, setShowDifficultyModal] = useState(false); // Tason valinta‑modal
  const [showInstructionsModal, setShowInstructionsModal] = useState(false); // Ohje‑modal
  const [modalMessage, setModalMessage] = useState("");              // Virheviesti modaliin

  // Tallentaa lempinimen
  useEffect(() => {
    if (route.params?.nickname) {
      setNickname(route.params.nickname);
    }
  }, [route.params?.nickname]);

  // Käynnistää ja pysäyttää kellon
  useEffect(() => {
    let iv;
    if (isRunning) iv = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [isRunning]);

  // Kun vaikeustaso muuttuu, generoidaan uusi lauta ja nollataan aika ja lauta
  useEffect(() => {
    setBoard(generateBoard(difficulty));
    setSelectedCell(null);
    setTimer(0);
    setIsRunning(true);
  }, [difficulty]);


  // Kun käyttäjä napauttaa ruutua, asetetaan se valituksi
  const onCellPress = (row, col) => {
    setSelectedCell({ row, col });
  };

  // Kun numero painetaan, kutsutaan logiikkafunktiota
  const onNumberPress = num => {
    if (!selectedCell) return;
    const newBoard = logicHandleNumberPress(board, selectedCell, noteMode, num);
    setBoard(newBoard);
  };

  // Tyhjennä‑painike: poistaa arvon tai muistiinpanot riippuen tilasta
  const onClearPress = () => {
    if (!selectedCell) return;
    const newBoard = logicHandleClearPress(board, selectedCell, noteMode);
    setBoard(newBoard);
  };

  // Tarkistaa sudokun, merkitsee virheet ja tallentaa oikein menneen tuloksen Firebaseen
  const onCheck = async () => {
    setSelectedCell(null);
    const { errors, hasError } = validateBoard(board);
    if (hasError) {
      // Korostaa virheelliset solut
      const errored = board.map((row, i) =>
        row.map((cell, j) => ({ ...cell, isError: errors[i][j] }))
      );
      setBoard(errored);
      setModalMessage("Fix the blue boxes and try again.");
      setShowErrorModal(true);
      return;
    }

    // Jos kaikki ok, pysäytetään kello ja tallennetaan tulos
    setIsRunning(false);
    const timeStr = formatTime(timer);
    try {
      await addDoc(collection(db, "SudokuGameResults"), {
        Nickname,
        difficulty,
        time: timeStr
      });
    } catch {}
    // Siirrytään tulosnäyttöön
    navigation.replace("SudokuResult", {
      time: timer,
      Nickname,
      difficulty
    });
  };

  // Näyttää vaikeustason valintamodalin
  const onRestart = () => setShowDifficultyModal(true);

  // Kun käyttäjä valitsee uuden tason, generoidaan uusi lauta
  const onSelectDifficulty = level => {
    setShowDifficultyModal(false);
    const newBoard = generateBoard(level);
    setBoard(newBoard);
    setSelectedCell(null);
    setTimer(0);
    setIsRunning(true);
    setDifficulty(level);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.difficultyText}>Difficulty: {difficulty}</Text>
        <Text style={styles.timerText}>Time: {formatTime(timer)}</Text>
      </View>

      {/* Sudoku‑ruudukko */}
      <Board
        board={board}
        selectedCell={selectedCell}
        onCellPress={onCellPress}
      />

      {/* Numeronäppäimistö ja toiminnot */}
      <NumberPad
        board={board}
        onNumberPress={onNumberPress}
        onClear={onClearPress}
        onCheck={onCheck}
        noteMode={noteMode}
        onToggleNote={() => setNoteMode(m => !m)}
        onShowInfo={() => setShowInstructionsModal(true)}
      />

      {/* Home ja Restart -napit */}
      <Controls onHome={() => navigation.navigate("Home")} onRestart={onRestart} />

      {/* Modaalit: ohjeet, virhe ja uuden tason valinta */}
      <InstructionsModal
        visible={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
      />
      <ErrorModal
        visible={showErrorModal}
        message={modalMessage}
        onClose={() => setShowErrorModal(false)}
      />
      <DifficultyModal
        visible={showDifficultyModal}
        onSelectDifficulty={onSelectDifficulty}
        onClose={() => setShowDifficultyModal(false)}
      />
    </View>
  );
}
