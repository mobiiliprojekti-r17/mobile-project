import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from "../styles/minesweeperStyles";

const GameButtons = ({ onInfoPress, onRestartPress, onHomePress, onResultsPress, showResults,}) => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.button} onPress={onInfoPress}>
      <MaterialCommunityIcons name="information" size={22} color='#fff' />
      <Text style={styles.buttonText}>Info</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={onRestartPress}>
      <MaterialCommunityIcons name="restart" size={23} color="#fff" />
      <Text style={styles.buttonText}>Restart</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={onHomePress}>
    <MaterialCommunityIcons name="home" size={24} color="#fff" />
    <Text style={styles.buttonText}>Home</Text>
    </TouchableOpacity>
    {showResults && (
      <TouchableOpacity style={styles.button} onPress={onResultsPress}>
        <MaterialCommunityIcons name="trophy-outline" size={22} color="#fff" />
        <Text style={styles.buttonText}>Results</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default GameButtons;