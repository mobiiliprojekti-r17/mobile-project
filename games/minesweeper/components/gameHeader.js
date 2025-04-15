import React from "react";
import { View, Text } from "react-native";
import  styles  from "../styles/minesweeperStyles";

const GameHeader = ({ difficulty, timer, remainingMines, formatTime }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.difficultyText}>Difficulty: {difficulty.toUpperCase()}</Text>
      <Text style={styles.timerText}>Time: {formatTime(timer)}</Text>
      <Text style={styles.mineCountText}>Mines left: {remainingMines}</Text>
    </View>
  );
};

export default GameHeader;
