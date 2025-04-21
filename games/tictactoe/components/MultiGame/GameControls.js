import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../../styles/TictactoeMultiStyles';

export default function GameControls({ onRestart, onHome }) {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onRestart}>
        <MaterialCommunityIcons name="restart" size={30} color="#fff" />
        <Text style={styles.buttonText}>Restart</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={onHome}>
        <MaterialCommunityIcons name="home" size={30} color="#fff" />
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}
