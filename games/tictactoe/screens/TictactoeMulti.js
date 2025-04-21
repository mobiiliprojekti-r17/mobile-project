import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useFonts, Audiowide_400Regular } from '@expo-google-fonts/audiowide';
import checkWinner from '../Utils/MultiGame/checkWinner';
import Board from '../components/MultiGame/Board';
import GameModal from '../Modals/MultiGame/ResultModal';
import GameControls from '../components/MultiGame/GameControls';
import styles from '../styles/TictactoeMultiStyles';

export default function TictactoeMultiplayer({ navigation }) {
  const [fontsLoaded] = useFonts({ Audiowide_400Regular });
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [winner, setWinner] = useState(null);

  const handlePress = (index) => {
    if (board[index] || gameOver) return;
    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const win = checkWinner(newBoard);
    if (win) {
      setWinner(win);
      setGameOver(true);
      setModalVisible(true);
      return;
    }
    if (!newBoard.includes(null)) {
      setWinner('Tie');
      setGameOver(true);
      setModalVisible(true);
      return;
    }
    setIsXNext(!isXNext);
  };

  const restart = () => {
    setBoard(Array(9).fill(null)); 
    setIsXNext(true); 
    setGameOver(false);  
    setWinner(null);
    setModalVisible(false); 
  };

  if (!fontsLoaded) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>
      <Text style={styles.title2}>Multiplayer</Text>
      <Text style={styles.turnText}>
        {gameOver
          ? (winner === 'Tie' ? "It's a tie!" : `${winner} wins!`)
          : `Whose turn: ${isXNext ? 'X' : 'O'}`}
      </Text>

      <Board board={board} onSquarePress={handlePress} disabled={gameOver} />

      <GameModal
        visible={modalVisible}
        message={winner === 'Tie' ? "It's a tie!" : `${winner} wins!`}
        onClose={() => setModalVisible(false)}
      />
      <GameControls
        onRestart={restart}
        onHome={() => navigation.navigate('Home')}
      />
    </View>
  );
}
