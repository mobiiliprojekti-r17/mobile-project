import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
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

export default function TictactoeMultiplayer({ navigation }) {
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

    const winner = checkWinner(newBoard);
    if (winner) {
      setWinner(winner);
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

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
    setModalVisible(false); 
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

      {/* Modaalin näyttäminen */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {winner === 'Tie' ? 'It\'s a tie!' : `${winner} wins!`}
            </Text>
            <TouchableOpacity
              style={styles.modalButton} 
              onPress={resetGame} 
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.button} onPress={resetGame}>
        <Text style={styles.buttonText}>Restart</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}
