import React from 'react';
import { View, Text } from 'react-native';
import styles from '../../styles/SudokuResultStyles';

export default function ScoreItem({ rank, score, formatTime, difficulty }) {
  return (
    <View style={styles.scoreItem}>
      <Text style={styles.rank}>#{rank}</Text>
      <Text style={styles.scoreText}>Nickname: {score.Nickname ?? "Unknown"}</Text>
      <Text style={styles.scoreText}>Time: {formatTime(score.timeInSeconds)}</Text>
    </View>
  );
}
