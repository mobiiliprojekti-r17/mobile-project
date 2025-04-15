import React from 'react';
import { View } from 'react-native';
import Cell from './cell';

const Connect4Board = ({ board, winnerCoords, dropDisc, styles }) => {
  return board.map((row, rowIndex) => (
    <View key={rowIndex} style={styles.row}>
      {row.map((cellValue, colIndex) => {
        const isWinningCell = winnerCoords.some(([r, c]) => r === rowIndex && c === colIndex);
        return (
          <Cell
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            value={cellValue}
            isWinningCell={isWinningCell}
            onPress={dropDisc}
            styles={styles}
          />
        );
      })}
    </View>
  ));
};

export default Connect4Board;
