import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import styles from '../../styles/SudokuStyles';

export default function Cell({ cell, row, col, selectedCell, onCellPress }) {
  // Tarkistaa, onko tämä solu juuri käyttäjän valitsema
  const isSelected =
    selectedCell && selectedCell.row === row && selectedCell.col === col;

  // Tyylilistan solulle: perus, ruudukkokuvio, paksut reunat, virhe- ja valintatilat
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
    // Solu valittavana alueena
    <TouchableOpacity
      style={cellStyles}
      onPress={() => onCellPress(row, col)}  // ilmoittaa valinnan yläkomponentille
    >
      {cell.value ? (
        // Jos solussa on arvo, näytetään se isolla tekstillä
        <Text
          style={[
            styles.cellText,
            !cell.preFilled && styles.userAddedNumberText,  // eri väri käyttäjän lisäämille luvuille
          ]}
        >
          {cell.value}
        </Text>
      ) : (
        // Jos solu on tyhjä, näytetään pienet muistiinpanot ruudukossa
        <View style={styles.notesContainer}>
          {[0, 1, 2].map(rowIndex => (                // kolme muistiinpanoriviä
            <View style={styles.notesRow} key={rowIndex}>
              {[0, 1, 2].map(colIndex => {
                const n = rowIndex * 3 + colIndex + 1;    // luku 1–9
                const visible = cell.notes.includes(n); 
                return (
                  <Text
                    key={n}
                    style={[
                      styles.noteText,
                      !visible && styles.noteHiddenText,      // piilotettu, jos ei muistiinpanolistassa
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
