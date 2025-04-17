import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import styles from '../../styles/SudokuResultStyles';
import ScoreItem from './ScoreItem';

export default function ScoreList({ scores, difficulty, formatTime }) {
  const list = scores
    .filter(s => s.difficulty === difficulty)
    .sort((a, b) => a.timeInSeconds - b.timeInSeconds)
    .slice(0, 10);

  if (!list.length) {
    return (
      <Text style={styles.noScores}>
        No scores yet for {difficulty}
      </Text>
    );
  }
  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.scoresContainer}>
        {list.map((score, i) => (
          <ScoreItem
            key={i}
            rank={i + 1}
            score={score}
            formatTime={formatTime}
          />
        ))}
      </View>
    </ScrollView>
  );
}
