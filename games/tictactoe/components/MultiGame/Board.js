import React from 'react';
import { View } from 'react-native';
import Square from './Square';
import styles from '../../styles/TictactoeMultiStyles';

export default function Board({ board, onSquarePress, disabled }) {
  const renderSquare = (index) => (
    <Square
      key={index}
      value={board[index]}
      onPress={() => onSquarePress(index)}
      disabled={disabled || !!board[index]}
    />
  );

  return (
    <View style={styles.boardContainer}>
      <View style={styles.board}>
        {[0, 1, 2].map(row => (
          <View key={row} style={styles.row}>
            {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
          </View>
        ))}
      </View>
    </View>
  );
}
