import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Vibration } from 'react-native';
import styles from '../styles/Connect4SingleStyles';
import Connect4Board from '../components/board';
import FlyingDisc from '../components/FlyingDisc';
import DifficultyModal from '../Modals/DifficultyModal';
import { ResultModalsingle } from '../Modals/resultModal';
import { useBoardDimensions } from '../hooks/useBoardDimensions';
import { useGameLogic } from '../Logic/useGameLogic';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//pelilaudan koko
const ROWS = 6;
const COLS = 7;

const Connect4SinglePlayer = ({ navigation }) => {
  // Modalin näkyvyys 
  const [difficultyModalVisible, setDifficultyModalVisible] = useState(true);
  const [modalSource, setModalSource] = useState('initial');
  
  // Valittu vaikeustaso (easy, medium, impossible)
  const [difficulty, setDifficulty] = useState('medium');

  // Laudan mitat lasketaan näkymän leveyden mukaan
  const { BOARD_PADDING, CELL_MARGIN, TOTAL_CELL_WIDTH, CELL_SIZE, X_OFFSET_CORRECTION } = useBoardDimensions(COLS);

  // Pelilogiikka‑hook, joka hoitaa state‑päivitykset ja AI-siirrot
  const { board, currentPlayer, winner, modalVisible: resultModalVisible, winnerCoords, flyingDisc, handlePlayerMove, startNewGame: logicStartNewGame, setModalVisible: setResultModalVisible
      } = useGameLogic( ROWS, COLS, TOTAL_CELL_WIDTH, BOARD_PADDING, CELL_MARGIN, X_OFFSET_CORRECTION, difficulty );

  // värinä, kun peli päättyy voittoon, tappioon tai tasapeliin
  useEffect(() => {
    if (winner) {
      Vibration.vibrate(500);
    }
  }, [winner]);

  // Käyttäjä painaa "Restart" – avataan vaikeustasovalikko uudelleenkäynnistystä varten
  const onPressRestart = () => {
    setModalSource('restart');
    setDifficultyModalVisible(true);
  };

  // "Cancel" modalista: jos modal avattiin initial-vuorossa, palataan takaisin sivulle
  const handleCancelDifficulty = () => {
    setDifficultyModalVisible(false);
    if (modalSource === 'initial') {
      setTimeout(() => navigation.goBack(), 100);
    }
  };
  
  // Käyttäjä valitsee vaikeustason modalissa
  const handleSelectDifficulty = (level) => {
    setDifficulty(level);
    // Jos modal avattiin restart-painikkeesta, nollataan peli logiikan kautta
    if (modalSource === 'restart') {
      logicStartNewGame();
    }
    setDifficultyModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect4</Text>
      <Text style={styles.title2}>Singleplayer</Text>

      {/* Näytä kenen vuoro on ja pelin päätyttyä pelin lopputulos */}
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

      {/* Pelilauta ja animoitu pudotuskiekko */}
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

      {/* Toimintonapit: Restart ja Home */}
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

      {/* Vaikeustasomodal: näkyy aluksi ja restartin jälkeen */}
      <DifficultyModal
        visible={difficultyModalVisible}
        onSelect={handleSelectDifficulty}
        onCancel={handleCancelDifficulty}
      />

      {/* Lopputulosmodal */}
      <ResultModalsingle
        visible={resultModalVisible}
        winner={winner}
        onClose={() => setResultModalVisible(false)}
      />
    </View>
  );
};

export default Connect4SinglePlayer;
