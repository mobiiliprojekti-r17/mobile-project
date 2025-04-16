import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/Feather";
import styles from "../styles/minesweeperStyles";

const GameButtons = ({ onInfoPress, onRestartPress, onHomePress, onResultsPress, showResults,}) => (
  <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.button} onPress={onInfoPress}>
      <Icon name="info" size={24} color="#fff" />
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={onRestartPress}>
      <Text style={styles.buttonText}>Restart</Text>
    </TouchableOpacity>
    <TouchableOpacity style={styles.button} onPress={onHomePress}>
      <Icon name="home" size={24} color="#fff" />
    </TouchableOpacity>
    {showResults && (
      <TouchableOpacity style={styles.button} onPress={onResultsPress}>
        <Text style={styles.buttonText}>Results</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default GameButtons;