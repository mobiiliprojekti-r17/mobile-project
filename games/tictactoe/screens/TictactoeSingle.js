import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
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
  const [modalVisible, setModalVisible] = useState(false);
  const [resultMessage, setResultMessage] = useState('');

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
      setResultMessage(`${winner === 'X' ? playerName : AIName} wins!`);
      setModalVisible(true);
      return;
    }

    if (!newBoard.includes(null)) {
      setGameOver(true);
      setResultMessage('It is a tie!');
      setModalVisible(true);
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
          setResultMessage(`${winner === 'O' ? AIName : playerName} wins!`);
          setModalVisible(true);
          return;
        }
      }
      setIsPlayerTurn(true);
    }, 1000);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameOver(false);
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
      <Text style={styles.title2}>Singleplayer</Text>
      <Text style={styles.turnText}>Whose turn: {isPlayerTurn ? playerName : AIName}</Text>
      <View style={styles.board}>
        {[0, 1, 2].map((row) => (
          <View style={styles.row} key={row}>
            {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
          </View>
        ))}
      </View>
      
      <TouchableOpacity style={styles.button} onPress={resetGame}>
        <Text style={styles.buttonText}>Restart</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={resetGame}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{resultMessage}</Text>
            <TouchableOpacity style={styles.modalButton} onPress={resetGame}>
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
