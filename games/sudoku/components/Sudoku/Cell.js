import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import styles from '../../styles/SudokuStyles';

export default function Cell({ cell, row, col, selectedCell, onCellPress }) {
  const isSelected =
    selectedCell && selectedCell.row === row && selectedCell.col === col;

  const cellStyles = [
    styles.cell,
    ((Math.floor(row / 3) + Math.floor(col / 3)) % 2 === 1) && styles.blueCell,
    row % 3 === 0 && row !== 0 && styles.boldTop,
    col % 3 === 0 && col !== 0 && styles.boldLeft,
    col === 8 && styles.boldRight,
    row === 8 && styles.boldBottom,
    cell.isError && styles.cellError,
    isSelected && styles.selectedCell,
    cell.preFilled && styles.preFilledCell,
  ];

  return (
    <TouchableOpacity
      style={cellStyles}
      onPress={() => onCellPress(row, col)}
    >
      {cell.value ? (
        <Text
          style={[
            styles.cellText,
            !cell.preFilled && styles.userAddedNumberText,
          ]}
        >
          {cell.value}
        </Text>
      ) : (
        <View style={styles.notesContainer}>
          {[0, 1, 2].map(rowIndex => (
            <View style={styles.notesRow} key={rowIndex}>
              {[0, 1, 2].map(colIndex => {
                const n = rowIndex * 3 + colIndex + 1;
                const visible = cell.notes.includes(n);
                return (
                  <Text
                    key={n}
                    style={[
                      styles.noteText,
                      !visible && styles.noteHiddenText,
                    ]}
                  >
                    {n}
                  </Text>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}
