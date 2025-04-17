import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import styles from '../../styles/SudokuResultStyles';

export default function FilterButtons({ selected, onSelect }) {
  return (
    <View style={styles.buttonContainer}>
      {["EASY","MEDIUM","HARD"].map(level => (
        <TouchableOpacity
          key={level}
          style={[
            styles.filterButton,
            selected === level && styles.selectedButton
          ]}
          onPress={() => onSelect(level)}
        >
          <Text style={styles.buttonText}>{level}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
