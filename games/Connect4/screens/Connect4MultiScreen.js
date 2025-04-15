import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/Connect4MultiStyles';
import Connect4Board from '../components/board';
import FlyingDisc from '../components/FlyingDisc';
import { ResultModalmulti } from '../components/resultModal';
import { useFonts, FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';
import Icon from "react-native-vector-icons/Feather";
import { useBoardDimensions } from '../hooks/useBoardDimensions';
import { useGameLogicMulti } from '../Logic/useGameLogicMulti';

const ROWS = 6;
const COLS = 7;

const Connect4Multiplayer = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    FredokaOne_400Regular,
  });
  const { BOARD_PADDING, CELL_MARGIN, TOTAL_CELL_WIDTH, CELL_SIZE, X_OFFSET_CORRECTION } = useBoardDimensions(COLS);
  const { board, currentPlayer, winner, modalVisible, winnerCoords, flyingDisc, handlePlayerMove, startNewGame, setModalVisible,
  } = useGameLogicMulti(ROWS, COLS, TOTAL_CELL_WIDTH, BOARD_PADDING, CELL_MARGIN, X_OFFSET_CORRECTION);

  return (
    !fontsLoaded ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading fonts...</Text>
      </View>
    ) : (
      <View style={styles.container}>
        <Text style={styles.title}>Connect4</Text>
        {!winner && (
          <Text style={styles.player}>
            Current Player:{" "}
            <Text style={{ color: currentPlayer === 'Orange' ? 'rgb(255, 94, 0)' : 'rgb(255, 234, 0)' }}>
              {currentPlayer}
            </Text>
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
        <TouchableOpacity style={styles.button} onPress={startNewGame}>
          <Text style={styles.buttonText}>
            {winner ? 'Start New Game' : 'Restart'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Icon name="home" size={30} color="#fff" />
        </TouchableOpacity>
        <ResultModalmulti
          visible={modalVisible}
          winner={winner}
          onClose={() => setModalVisible(false)}
        />
      </View>
    )
  );
};

export default Connect4Multiplayer;
