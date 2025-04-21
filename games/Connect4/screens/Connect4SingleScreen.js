// src/screens/Connect4SinglePlayer.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Vibration } from 'react-native';
import { useFonts, FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';
import styles from '../styles/Connect4SingleStyles';
import Connect4Board from '../components/board';
import FlyingDisc from '../components/FlyingDisc';
import DifficultyModal from '../Modals/DifficultyModal';
import { ResultModalsingle } from '../Modals/resultModal';
import { useBoardDimensions } from '../hooks/useBoardDimensions';
import { useGameLogic } from '../Logic/useGameLogic';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const ROWS = 6;
const COLS = 7;

const Connect4SinglePlayer = ({ navigation }) => {
  // fontit
  const [fontsLoaded] = useFonts({ FredokaOne_400Regular });
  
  // modalin tila ja lähde (initial vs. restart)
  const [difficultyModalVisible, setDifficultyModalVisible] = useState(true);
  const [modalSource, setModalSource] = useState('initial');
  
  // valittu vaikeustaso
  const [difficulty, setDifficulty] = useState('medium');

  // board‑dimensiot hookista
  const {
    BOARD_PADDING,
    CELL_MARGIN,
    TOTAL_CELL_WIDTH,
    CELL_SIZE,
    X_OFFSET_CORRECTION
  } = useBoardDimensions(COLS);

  // pelilogiikka hook (huom: difficulty viimeisenä parametrina)
  const {
    board,
    currentPlayer,
    winner,
    modalVisible: resultModalVisible,
    winnerCoords,
    flyingDisc,
    handlePlayerMove,
    startNewGame: logicStartNewGame,
    setModalVisible: setResultModalVisible,
  } = useGameLogic(
    ROWS,
    COLS,
    TOTAL_CELL_WIDTH,
    BOARD_PADDING,
    CELL_MARGIN,
    X_OFFSET_CORRECTION,
    difficulty
  );

  // tärinä voittotilanteessa
  useEffect(() => {
    if (winner) {
      Vibration.vibrate(500);
    }
  }, [winner]);

  // Käyttäjä painaa Restart
  const onPressRestart = () => {
    setModalSource('restart');
    setDifficultyModalVisible(true);
  };

  // Cancel‑nappi difficulty‑modalissa
  const handleCancelDifficulty = () => {
    // 1) Piilotetaan modaali heti
    setDifficultyModalVisible(false);
  
    // 2) Jos tultiin homescreeniltä, navigoidaan takaisin pienen viiveen jälkeen
    if (modalSource === 'initial') {
      setTimeout(() => navigation.goBack(), 100);
    }
  };
  
  const handleSelectDifficulty = (level) => {
    setDifficulty(level);
  
    // nollaa peli vain jos modal avattiin Restartista
    if (modalSource === 'restart') {
      logicStartNewGame();
    }
  
    setDifficultyModalVisible(false);
  };
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect4</Text>
      <Text style={styles.title2}>Singleplayer</Text>

      {!winner ? (
  <Text style={styles.player}>
    Current Player: {currentPlayer === 'Orange' ? 'AI' : 'You'}
  </Text>
) : winner === 'Draw' ? (
  <Text style={styles.player}>It is a draw!</Text>
) : (
  <Text style={styles.player}>
    Winner: {winner === 'Orange' ? 'AI wins!' : 'You win!'}
  </Text>
)}


      <View style={[styles.board, { position: 'relative' }]}>
        <Connect4Board
          board={board}
          winnerCoords={winnerCoords}
          dropDisc={handlePlayerMove}
          styles={styles}
        />
        {flyingDisc && (
          <FlyingDisc
            color={flyingDisc.color}
            toY={flyingDisc.toY}
            xOffset={flyingDisc.xOffset}
            cellSize={flyingDisc.cellSize}
            onEnd={flyingDisc.onEnd}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onPressRestart}>
          <MaterialCommunityIcons name="restart" size={30} color="#fff" />
          <Text style={styles.buttonText}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="home" size={30} color="#fff" />
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>

      <DifficultyModal
        visible={difficultyModalVisible}
        onSelect={handleSelectDifficulty}
        onCancel={handleCancelDifficulty}
      />

      <ResultModalsingle
        visible={resultModalVisible}
        winner={winner}
        onClose={() => setResultModalVisible(false)}
      />
    </View>
  );
};

export default Connect4SinglePlayer;
