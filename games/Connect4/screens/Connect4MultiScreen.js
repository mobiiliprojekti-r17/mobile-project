import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Vibration } from 'react-native';
import styles from '../styles/Connect4MultiStyles';
import Connect4Board from '../components/board'; 
import FlyingDisc from '../components/FlyingDisc'; 
import { ResultModalmulti } from '../Modals/resultModal';
import { useBoardDimensions } from '../hooks/useBoardDimensions'; 
import { useGameLogicMulti } from '../Logic/useGameLogicMulti'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//pelilaudan koko
const ROWS = 6;
const COLS = 7;

const Connect4Multiplayer = ({ navigation }) => {
  // Lasketaan laudalle padding, solujen marginaalit ja koko
  const { BOARD_PADDING, CELL_MARGIN, TOTAL_CELL_WIDTH, CELL_SIZE, X_OFFSET_CORRECTION } = useBoardDimensions(COLS);

  // Haetaan pelin tila‑ ja toiminnot hookista
  const { board, currentPlayer, winner, modalVisible, winnerCoords, flyingDisc, handlePlayerMove, startNewGame, setModalVisible
  } = useGameLogicMulti( ROWS, COLS, TOTAL_CELL_WIDTH, BOARD_PADDING, CELL_MARGIN, X_OFFSET_CORRECTION );

  // Tärinä voittohetkellä
  useEffect(() => {
    if (winner) {
      Vibration.vibrate(500);
    }
  }, [winner]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect4</Text>
      <Text style={styles.title2}>Multiplayer</Text>

      {/* Näytä vuorossa oleva pelaaja tai voiton jälkeen voittaja */}
      {!winner ? (
        <Text style={styles.player}>
          Current Player:{' '}
          <Text style={{ color: currentPlayer === 'Orange' ? 'rgb(255, 94, 0)' : 'rgb(255, 234, 0)' }}>
            {currentPlayer}
          </Text>
        </Text>
      ) : winner === 'Draw' ? (
        <Text style={styles.player}>It is a draw!</Text>
      ) : (
        <Text style={styles.player}>
          Winner:{' '}
          <Text style={{ color: winner === 'Orange' ? 'rgb(255, 94, 0)' : 'rgb(255, 234, 0)' }}>
            {winner}!
          </Text>
        </Text>
      )}

      {/* Pelilauta ja pudotteleva kiekko animaatiota varten */}
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

      {/* Toimintonapit uudelle peli­lle ja kotinäytölle*/}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={startNewGame}>
          <MaterialCommunityIcons name="restart" size={30} color="#fff" />
          <Text style={styles.buttonText}>
            {winner ? 'Start New Game' : 'Restart'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <MaterialCommunityIcons name="home" size={30} color="#fff" />
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        
      {/* Tulosmodal */}
        <ResultModalmulti
          visible={modalVisible}
          winner={winner}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </View>
  );
};

export default Connect4Multiplayer;
