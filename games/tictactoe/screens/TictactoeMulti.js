import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Button } from 'react-native';
import styles from '../styles/TictactoeMultiStyles';

const checkWinner = (board) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], 
    [0, 3, 6], [1, 4, 7], [2, 5, 8], 
    [0, 4, 8], [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

export default function TictactoeMultiplayer({navigation}) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const handlePress = (index) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      Alert.alert(`${winner} wins!`, 'Game over!', [
        { text: 'Play again', onPress: resetGame },
        { text: 'Home', onPress: () => navigation.navigate("Home") },
      ]);
      return;
    }

    if (!newBoard.includes(null)) {
      setGameOver(true);
      Alert.alert('It is a tie!', 'The game ended in a draw.', [
              { text: 'Play again', onPress: resetGame },
              { text: 'Home', onPress: () => navigation.navigate("Home") },
            ]);
      return;
    }

    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
  };

  const renderSquare = (index) => (
    <TouchableOpacity
      key={index} 
      style={styles.square}
      onPress={() => handlePress(index)}
      disabled={!!board[index] || gameOver}
    >
      <Text style={styles.squareText}>{board[index]}</Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>
      <Text style={styles.title2}>Multiplayer</Text>
      <Text style={styles.turnText}>Whose turn: {isXNext ? "X" : "O"}</Text>
      <View style={styles.board}>
        {[0, 1, 2].map((row) => (
          <View style={styles.row} key={row}>
            {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
          </View>
        ))}
      </View>
      {/* Custom Restart Button */}
      <TouchableOpacity style={styles.button} onPress={resetGame}>
        <Text style={styles.buttonText}>Restart</Text>
      </TouchableOpacity>

      {/* Custom Home Button */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}
