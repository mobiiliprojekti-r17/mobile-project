import React from 'react'; 
import { View } from 'react-native';  
import styles from '../../styles/SudokuStyles';  // Tyylit
import Cell from './Cell';   // Yksittäisen solun komponentti

export default function Board({ board, selectedCell, onCellPress }) {
  return (
    <>
      {/* Käydään läpi jokainen rivi Sudoku-laudassa */}
      {board.map((rowArr, ri) => (
        <View key={ri} style={styles.row}>
          {/* Käydään läpi jokainen solu tässä rivissä */}
          {rowArr.map((cell, ci) => (
            <Cell
              key={ci} 
              cell={cell} 
              row={ri}                     // Rivin numero (0–8)
              col={ci}                     // Sarakkeen numero (0–8)
              selectedCell={selectedCell}  // Tieto siitä, mikä solu on juuri valittuna
              onCellPress={onCellPress}    // Funktio, jota kutsutaan kun solua painetaan
            />
          ))}
        </View>
      ))}
    </>
  );
}
