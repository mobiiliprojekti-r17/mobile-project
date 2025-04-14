import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import styles from '../styles/Connect4MultiStyles';

const Connect4Multiplayer = ({ navigation }) => {
  const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('Orange');
  const [winner, setWinner] = useState(null);
  const [modalVisible, setModalVisible] = useState(false); 

  const dropDisc = (col) => {
    if (winner) return;

    for (let row = 5; row >= 0; row--) {
      if (!board[row][col]) {
        const newBoard = [...board];
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);

        const win = checkWinner(newBoard);
        if (win) {
          setWinner(win);
          setModalVisible(true);
        } else {
          setCurrentPlayer(currentPlayer === 'Orange' ? 'Yellow' : 'Orange');
        }
        return;
      }
    }
  };

  const renderCell = (row, col) => {
    const cellColor = board[row][col] === 'Orange'
      ? 'rgb(255, 94, 0)'
      : board[row][col] === 'Yellow'
      ? 'rgb(255, 234, 0)'
      : 'transparent';

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={styles.cell}
        onPress={() => dropDisc(col)}
      >
        {board[row][col] && (
          <View
            style={[styles.disc, {
              backgroundColor: cellColor,
            }]}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
      </View>
    ));
  };

  const checkWinner = (board) => {

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] &&
          board[row][col] === board[row][col + 1] &&
          board[row][col] === board[row][col + 2] &&
          board[row][col] === board[row][col + 3]
        ) {
          return board[row][col];
        }
      }
    }
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row < 3; row++) {
        if (
          board[row][col] &&
          board[row][col] === board[row + 1][col] &&
          board[row][col] === board[row + 2][col] &&
          board[row][col] === board[row + 3][col]
        ) {
          return board[row][col];
        }
      }
    }
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (
          board[row][col] &&
          board[row][col] === board[row + 1][col + 1] &&
          board[row][col] === board[row + 2][col + 2] &&
          board[row][col] === board[row + 3][col + 3]
        ) {
          return board[row][col];
        }
      }
    }
    for (let row = 0; row < 3; row++) {
      for (let col = 6; col > 2; col--) {
        if (
          board[row][col] &&
          board[row][col] === board[row + 1][col - 1] &&
          board[row][col] === board[row + 2][col - 2] &&
          board[row][col] === board[row + 3][col - 3]
        ) {
          return board[row][col];
        }
      }
    }

    return null;
  };

  const startNewGame = () => {
    setBoard(Array(6).fill(null).map(() => Array(7).fill(null)));
    setWinner(null);
    setCurrentPlayer('Orange');
    setModalVisible(false); 
  };

  const modalBackgroundColor = winner === 'Orange' ? 'rgb(255, 94, 0)' : 'rgb(255, 234, 0)';
  const modalButtonBackgroundColor = winner === 'Orange' ? 'rgb(200, 75, 0)' : 'rgb(255, 204, 0)';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect4</Text>
      {!winner && (
        <Text style={styles.player}>
          Current Player:{' '}
          <Text style={{ color: currentPlayer === 'Orange' ? 'rgb(255, 94, 0)' : 'rgb(255, 234, 0)' }}>
            {currentPlayer === 'Orange' ? 'Orange' : 'Yellow'}
          </Text>
        </Text>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: "rgba(0, 0, 0, 0.4)" }]}>
          <View style={[styles.modalContent, { backgroundColor: modalBackgroundColor }]}>
            <Text style={styles.modalText}>
              {winner === 'Orange' ? 'Orange' : 'Yellow'} Wins!
            </Text>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: modalButtonBackgroundColor }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.board}>{renderBoard()}</View>

      <TouchableOpacity style={styles.button} onPress={startNewGame}>
        <Text style={styles.buttonText}>
          {winner ? 'Start New Game' : 'Restart'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Connect4Multiplayer;
