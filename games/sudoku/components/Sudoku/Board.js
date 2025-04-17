import React from 'react';
import { View } from 'react-native';
import styles from '../../styles/SudokuStyles';
import Cell from './Cell';

export default function Board({ board, selectedCell, onCellPress }) {
  return (
    <>
      {board.map((rowArr, ri) => (
        <View key={ri} style={styles.row}>
          {rowArr.map((cell, ci) => (
            <Cell
              key={ci}
              cell={cell}
              row={ri}
              col={ci}
              selectedCell={selectedCell}
              onCellPress={onCellPress}
            />
          ))}
        </View>
      ))}
    </>
  );
}
