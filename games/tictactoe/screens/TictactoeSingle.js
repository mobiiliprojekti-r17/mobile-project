import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import styles from "../styles/TictactoeSingleStyles";

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

const makeAIMove = (newBoard) => {
  for (let i = 0; i < 9; i++) {
    if (!newBoard[i]) {
      newBoard[i] = 'O';
      if (checkWinner(newBoard) === 'O') return i;
      newBoard[i] = null;
    }
  }

  for (let i = 0; i < 9; i++) {
    if (!newBoard[i]) {
      newBoard[i] = 'X';
      if (checkWinner(newBoard) === 'X') return i;
      newBoard[i] = null;
    }
  }

  const bestMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7];
  for (let i of bestMoves) {
    if (!newBoard[i]) return i;
  }

  return null;
};

export default function TictactoeSingleplayer({ navigation }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  // Pelaajien nimet
  const [playerName, setPlayerName] = useState("You");
  const [AIName, setAIName] = useState("AI");

  const handlePress = (index) => {
    if (board[index] || gameOver || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      Alert.alert(`${winner === 'X' ? playerName : AIName} wins!`, 'Game over!', [
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

    setTimeout(() => {
      const computerMove = makeAIMove(newBoard);
      if (computerMove !== null) {
        newBoard[computerMove] = 'O';
        setBoard([...newBoard]);

        const winner = checkWinner(newBoard);
        if (winner) {
          setGameOver(true);
          Alert.alert(`${winner === 'O' ? AIName : playerName} wins!`, 'Game over!', [
            { text: 'Play again', onPress: resetGame },
            { text: 'Home', onPress: () => navigation.navigate("Home") },
          ]);
          return;
        }
      }
      setIsPlayerTurn(true);
    }, 1000); // AI odottaa 1 sekunnin ennen siirron tekemistä
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
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
      <Text style={styles.title2}>Singleplayer</Text>
      <Text style={styles.turnText}>Whose turn: {isPlayerTurn ? playerName : AIName}</Text>
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
