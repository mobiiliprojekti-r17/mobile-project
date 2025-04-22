import React from 'react';
import { TouchableOpacity, View } from 'react-native';

// Yksittäinen Cell-komponentti Connect4-ruudukossa
const Cell = ({ row, col, value, isWinningCell, onPress, styles }) => {
  // Määrittää kiekon värin pelaajien mukaan
  const cellColor =
    value === 'Yellow'
      ? 'rgb(255, 234, 0)'    // Pelaaja Yellow
      : value === 'Orange'
      ? 'rgb(255, 94, 0)'     // Pelaaja Orange
      : 'transparent';        // Tyhjä ruutu

  // Jos solu kuuluu voittorivin joukkoon, piirretään paksumpi valkoinen reunus voittoriville
  const highlightStyle = isWinningCell
    ? { borderWidth: 3, borderColor: '#fff' }
    : {};

  return (
    // Alue, joka tiputtaa kiekon tähän sarakkeeseen
    <TouchableOpacity
      style={styles.cell}          // solun perusmuotoilu
      onPress={() => onPress(col)} // kutsu dropDisc-funktiota sarakeindeksillä
    >
      {value && (                  // Jos solussa on arvo (kiekko), piirretään se
        <View
          style={[
            styles.disc,           // kiekon perustyyli 
            { backgroundColor: cellColor }, // kiekon väri
            highlightStyle         // voittorivin korostus, jos kuuluu voittoriviin
          ]}
        />
      )}
    </TouchableOpacity>
  );
};

export default Cell;
