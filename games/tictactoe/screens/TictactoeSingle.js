import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { useFonts, Audiowide_400Regular } from '@expo-google-fonts/audiowide';
import styles from '../styles/TictactoeSingleStyles';
import Board from '../components/SingleGame/Board';
import GameControls from '../components/SingleGame/GameControls';
import LevelModal from '../Modals/SingleGame/LevelModal';
import ResultModal from '../Modals/SingleGame/ResultModal';
import { checkWinner, makeAIMove } from '../Utils/SingleGame/gameUtils';

export default function TictactoeSingleplayer({ navigation }) {
  const [fontsLoaded] = useFonts({ Audiowide_400Regular });
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [levelModalVisible, setLevelModalVisible] = useState(true);
  const [resultModalVisible, setResultModalVisible] = useState(false);
  const [level, setLevel] = useState('medium');
  const [resultMessage, setResultMessage] = useState('');

  const handleSelectLevel = l => {
    setLevel(l);
    setLevelModalVisible(false);
  };

  const handleSquarePress = idx => {
    if (board[idx] || gameOver) return;
    const newBoard = [...board];
    newBoard[idx] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const winner = checkWinner(newBoard);
    if (winner) return endGame(winner);
    if (!newBoard.includes(null)) return endGame(null);

    setTimeout(() => {
      const aiIdx = makeAIMove([...newBoard], level);
      if (aiIdx != null) {
        newBoard[aiIdx] = 'O';
        setBoard(newBoard);
        const w = checkWinner(newBoard);
        if (w) return endGame(w);
      }
      setIsPlayerTurn(true);
    }, 500);
  };

  const endGame = winner => {
    setGameOver(true);
    setResultMessage(
      winner ? (winner === 'X' ? 'You' : 'AI') + ' win!' : 'It is a tie!'
    );
    setResultModalVisible(true);
  };

  const closeResult = () => setResultModalVisible(false);
  const restart = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
    setLevelModalVisible(true);
  };

  if (!fontsLoaded) return null;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>
      <Text style={styles.title2}>Singleplayer</Text>

      <LevelModal visible={levelModalVisible} onSelect={handleSelectLevel} />


      <Text style={styles.turnText}>
      {gameOver
        ? resultMessage
        : `Whose turn: ${isPlayerTurn ? 'You' : 'AI'}`}
    </Text>


      <Board
        board={board}
        onSquarePress={handleSquarePress}
        disabled={gameOver}
      />
      <GameControls
        onRestart={restart}
        onHome={() => navigation.navigate('Home')}
      />
      <ResultModal
        visible={resultModalVisible}
        message={resultMessage}
        onClose={closeResult}
      />
    </View>
  );
}
