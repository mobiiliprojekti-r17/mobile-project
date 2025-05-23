import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from '../../styles/TictactoeSingleStyles';

export default function Square({ value, onPress, disabled }) {
  return (
    // ruudut
    <TouchableOpacity
      style={styles.square}  
      onPress={onPress}  
      disabled={disabled} 
    >
      {/* Näyttää ruudun sisällön: 'X', 'O' tai tyhjä */}
      <Text style={styles.squareText}>{value}</Text>
    </TouchableOpacity>
  );
}
