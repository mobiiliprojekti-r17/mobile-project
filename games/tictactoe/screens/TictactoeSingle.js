import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Button } from 'react-native';
import styles from '../styles/Multistyles';

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

// Uusi fiksumpi tekoäly siirron tekemiseen
const makeAIMove = (newBoard) => {
  // 1. Tarkista, voiko AI voittaa seuraavalla siirrolla
  for (let i = 0; i < 9; i++) {
    if (!newBoard[i]) {
      newBoard[i] = 'O';
      if (checkWinner(newBoard) === 'O') return i;
      newBoard[i] = null; // Peru siirto
    }
  }

  // 2. Tarkista, voiko pelaaja voittaa seuraavalla siirrolla ja estä se
  for (let i = 0; i < 9; i++) {
    if (!newBoard[i]) {
      newBoard[i] = 'X';
      if (checkWinner(newBoard) === 'X') return i;
      newBoard[i] = null; // Peru siirto
    }
  }

  // 3. Jos ei kiireellistä voittoa tai estoa, valitse paras strateginen paikka
  const bestMoves = [4, 0, 2, 6, 8, 1, 3, 5, 7]; // Keskusta ensin, sitten kulmat
  for (let i of bestMoves) {
    if (!newBoard[i]) return i;
  }

  return null;
};

export default function TictactoeSingleplayer({navigation}) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const handlePress = (index) => {
    if (board[index] || gameOver || !isPlayerTurn) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);

    const winner = checkWinner(newBoard);
    if (winner) {
      setGameOver(true);
      Alert.alert(`${winner} voitti!`, 'Peli on päättynyt.', [{ text: 'OK', onPress: resetGame }]);
      return;
    }

    if (!newBoard.includes(null)) {
      setGameOver(true);
      Alert.alert('Tasapeli', 'Peli päättyi tasapeliin.', [{ text: 'OK', onPress: resetGame }]);
      return;
    }

    setTimeout(() => {
      const computerMove = makeAIMove(newBoard); // Käytä uutta makeAIMove-funktiota
      if (computerMove !== null) {
        newBoard[computerMove] = 'O';
        setBoard([...newBoard]);

        const winner = checkWinner(newBoard);
        if (winner) {
          setGameOver(true);
          Alert.alert(`${winner} voitti!`, 'Peli on päättynyt.', [{ text: 'OK', onPress: resetGame }]);
          return;
        }
      }
      setIsPlayerTurn(true);
    }, 500);
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
      <View style={styles.board}>
        {[0, 1, 2].map((row) => (
          <View style={styles.row} key={row}>
            {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
          </View>
        ))}
      </View>
      <Button title="Restart" onPress={resetGame} />
      <Button title="Palaa päävalikkoon" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}
