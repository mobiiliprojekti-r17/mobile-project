import React from 'react';
import { View } from 'react-native';
import Square from './Square';               // Yksittäinen peliruutu-komponentti
import styles from '../../styles/TictactoeSingleStyles';

export default function Board({ board, onSquarePress, disabled }) {
  return (
    <View style={styles.board}>
      {/* Kolme vaakariviä (0–2) */}
      {[0, 1, 2].map(row => (
        <View key={row} style={styles.row}>
          {/* Jokaisessa rivissä kolme saraketta (0–2) */}
          {[0, 1, 2].map(col => {
            const idx = row * 3 + col;  
            return (
              // Näyttää yhden ruudun
              <Square
                key={idx}
                value={board[idx]}           // Näyttää X, O tai tyhjän
                onPress={() => onSquarePress(idx)}  // Kutsuu funktiota, kun tätä painetaan
                disabled={disabled || !!board[idx]} // Estää painamisen, jos peli ohi tai ruutu jo täynnä
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}
