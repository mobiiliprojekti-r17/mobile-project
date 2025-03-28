import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/styles'; 

const Connect4 = () => {
  const [board, setBoard] = useState(Array(6).fill(null).map(() => Array(7).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('Red');
  const [winner, setWinner] = useState(null);

  const dropDisc = (col) => {
    if (winner) return; // Ei voi pelata, jos peli on jo ohi

    // Etsi ensimmäinen tyhjä rivi valitussa sarakkeessa
    for (let row = 5; row >= 0; row--) {
      if (!board[row][col]) {
        const newBoard = [...board];
        newBoard[row][col] = currentPlayer;
        setBoard(newBoard);

        // Tarkistetaan voittaja
        const winner = checkWinner(newBoard);
        if (winner) {
          setWinner(winner); // Asetetaan voittaja
        } else {
          setCurrentPlayer(currentPlayer === 'Red' ? 'Yellow' : 'Red');
        }
        return;
      }
    }
  };

  const renderCell = (row, col) => {
    return (
      <TouchableOpacity 
        key={`${row}-${col}`} // Ainutlaatuinen key joka riville ja sarakkeelle
        style={styles.cell} 
        onPress={() => dropDisc(col)}>
        {board[row][col] && (
          <View
            style={[styles.disc, { backgroundColor: board[row][col] === 'Red' ? 'red' : 'yellow' }]}
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
    // Vaakasuora tarkistus
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] && board[row][col] === board[row][col + 1] && board[row][col] === board[row][col + 2] && board[row][col] === board[row][col + 3]) {
          return board[row][col];
        }
      }
    }

    // Pystysuora tarkistus
    for (let col = 0; col < 7; col++) {
      for (let row = 0; row < 3; row++) {
        if (board[row][col] && board[row][col] === board[row + 1][col] && board[row][col] === board[row + 2][col] && board[row][col] === board[row + 3][col]) {
          return board[row][col];
        }
      }
    }

    // Vinottain vasemmalta oikealle / ylhäältä alas
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (board[row][col] && board[row][col] === board[row + 1][col + 1] && board[row][col] === board[row + 2][col + 2] && board[row][col] === board[row + 3][col + 3]) {
          return board[row][col];
        }
      }
    }

    // Vinottain oikealta vasemmalle / ylhäältä alas
    for (let row = 0; row < 3; row++) {
      for (let col = 6; col > 2; col--) {
        if (board[row][col] && board[row][col] === board[row + 1][col - 1] && board[row][col] === board[row + 2][col - 2] && board[row][col] === board[row + 3][col - 3]) {
          return board[row][col];
        }
      }
    }

    return null;
  };

  const startNewGame = () => {
    setBoard(Array(6).fill(null).map(() => Array(7).fill(null)));
    setWinner(null);
    setCurrentPlayer('Red');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Connect 4</Text>
      <Text>Current Player: {currentPlayer}</Text>
      {winner && <Text style={styles.winnerText}>{winner} Wins!</Text>}
      <View style={styles.board}>{renderBoard()}</View>
      {winner && (
        <TouchableOpacity style={styles.button} onPress={startNewGame}>
          <Text style={styles.buttonText}>Start New Game</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Connect4;
