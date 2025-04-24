import React from "react";
import { View, Text } from "react-native";
import styles from "../styles/minesweeperStyles";

// Näyttää pelin yläosan tiedot: vaikeustason, ajan ja miinojen määrän
const GameHeader = ({ difficulty, timer, remainingMines, formatTime }) => {
  return (
    <View style={styles.header}>
      {/* Vaikeustason näyttö */}
      <View style={styles.headerItem}>
        <Text style={styles.labelText}>Difficulty:</Text>
        <Text style={styles.valueText}>{difficulty.toUpperCase()}</Text>
      </View>
      {/* Ajastimen näyttö */}
      <View style={styles.headerItem}>
        <Text style={styles.labelText}>Time:</Text>
        <Text style={styles.valueText}>{formatTime(timer)}</Text>
      </View>
      {/* Jäljellä olevien miinojen määrä */}
      <View style={styles.headerItem}>
        <Text style={styles.labelText}>Mines:</Text>
        <Text style={styles.valueText}>{remainingMines}</Text>
      </View>
    </View>
  );
};

export default GameHeader;
