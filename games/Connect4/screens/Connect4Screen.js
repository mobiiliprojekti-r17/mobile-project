import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/Connect4Styles';

const Connect4 = ({ navigation }) => {
  const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('DarkGreen');
  const [winner, setWinner] = useState(null);

  const dropDisc = (col) => {
    if (winner) return; // Prevent playing if there is already a winner

    for (let row = 5; row >= 0; row--) {
      if (!board[row][col]) {
        const newBoard = [...board];
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);

        const winner = checkWinner(newBoard);
        if (winner) {
          setWinner(winner);
        } else {
          setCurrentPlayer(currentPlayer === 'DarkGreen' ? 'LightGreen' : 'DarkGreen');
        }
        return;
      }
    }
  };

  const renderCell = (row, col) => {
    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={styles.cell}
        onPress={() => dropDisc(col)}
      >
        {board[row][col] && (
          <View
            style={[
              styles.disc,
              {
                backgroundColor:
                  board[row][col] === 'DarkGreen' ? '#006400' : '#32CD32',
              },
            ]}
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
    // Horizontal
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

    // Vertical
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

    // Diagonal (top-left to bottom-right)
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

    // Diagonal (top-right to bottom-left)
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
    setCurrentPlayer('DarkGreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect4</Text>
      <Text style= {styles.player}>
        Current Player:{' '}
        <Text style={{ color: currentPlayer === 'DarkGreen' ? '#006400' : '#32CD32' }}>
          {currentPlayer === 'DarkGreen' ? 'DarkGreen' : 'LightGreen'}
        </Text>
      </Text>
      {winner && (
        <Text style={styles.winnerText}>
          {winner === 'DarkGreen' ? 'DarkGreen' : 'LightGreen'} Wins!
        </Text>
      )}
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

export default Connect4;
