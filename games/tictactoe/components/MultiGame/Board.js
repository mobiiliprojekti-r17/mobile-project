import React from 'react';
import { View } from 'react-native';
import Square from './Square'; 
import styles from '../../styles/TictactoeMultiStyles';

export default function Board({ board, onSquarePress, disabled }) {
  // Luo yhden peliruudun annetulla indeksillä
  const renderSquare = (index) => (
    <Square
      key={index}                           // Uniikki avain Reactille
      value={board[index]}                  // Näyttää X, O tai pysyy tyhjänä
      onPress={() => onSquarePress(index)}  // Kutsuu ruudun painamis funktiota, kun painetaan
      disabled={disabled || !!board[index]} // Estää painalluksen, jos peli ohi tai ruutu täynnä
    />
  );

  return (
    <View style={styles.boardContainer}>
      {/*  peliruudukko */}
      <View style={styles.board}>
        {/* Luodaan kolme vaakariviä (0,1,2) */}
        {[0, 1, 2].map(row => (
          <View key={row} style={styles.row}>
            {/* Jokaisessa rivissä kolme ruutua kullekin sarakkeelle */}
            {[0, 1, 2].map(col => renderSquare(row * 3 + col))}
          </View>
        ))}
      </View>
    </View>
  );
}
