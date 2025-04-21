import React from 'react';
import { View } from 'react-native';
import Square from './Square';
import styles from '../../styles/TictactoeSingleStyles';

export default function Board({ board, onSquarePress, disabled }) {
  return (
    <View style={styles.board}>
      {[0, 1, 2].map(row => (
        <View key={row} style={styles.row}>
          {[0, 1, 2].map(col => {
            const idx = row * 3 + col;
            return (
              <Square
                key={idx}
                value={board[idx]}
                onPress={() => onSquarePress(idx)}
                disabled={disabled || !!board[idx]}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}
