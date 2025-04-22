import React from 'react';
import { View } from 'react-native';
import Cell from './cell';

// Pelilaudan piirtävä komponentti
const Connect4Board = ({ board, winnerCoords, dropDisc, styles }) => {
  return (
    // Käydään läpi jokainen pelirivin taulukon rivi
    board.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((cellValue, colIndex) => {
          // Tarkistetaan, kuuluuko tämä ruutu voittoriviin
          const isWinningCell = winnerCoords.some(
            ([r, c]) => r === rowIndex && c === colIndex
          );
          return (
            // Piirretään yksi solu
            <Cell
              key={`${rowIndex}-${colIndex}`}    // Uniikki avain Reactille
              row={rowIndex}                     // Rivin indeksi
              col={colIndex}                     // Sarakkeen indeksi
              value={cellValue}                  // Kumpi pelaaja on solussa (tai tyhjä)
              isWinningCell={isWinningCell}      // Korostaako voiton väriä
              onPress={dropDisc}                 // Funktio, joka tiputtaa kiekon sarakkeeseen
              styles={styles}                    // Tyylit komponentille
            />
          );
        })}
      </View>
    ))
  );
};

export default Connect4Board;
