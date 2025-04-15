import React, { useMemo } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/minesweeperResultsStyles";

const ScoreList = ({ scores, selectedDifficulty, formattedTime }) => {

  const groupedScores = useMemo(() => {
    return scores.reduce((acc, score) => {
      const level = score.difficulty || "Unknown";
      if (!acc[level]) acc[level] = [];
      acc[level].push(score);
      return acc;
    }, {});
  }, [scores]);

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      {Object.keys(groupedScores).length > 0 ? (
        Object.keys(groupedScores)
          .filter(
            (diffLevel) => !selectedDifficulty || diffLevel === selectedDifficulty
          )
          .map((diffLevel) => (
            <View key={diffLevel} style={styles.difficultySection}>
              <Text style={styles.difficultyTitle}>
                {diffLevel ? diffLevel.toUpperCase() : "ALL"}
              </Text>
              {(groupedScores[diffLevel] || [])
                .sort((a, b) => a.timeInSeconds - b.timeInSeconds)
                .map((score, index) => (
                  <View key={index} style={styles.scoreItem}>
                    <Text style={styles.rank}>#{index + 1}</Text>
                    <Text style={styles.scoreText}>
                      Nickname: {score.nickname ?? "Unknown"}
                    </Text>
                    <Text style={styles.scoreText}>
                      Difficulty: {score.difficulty ?? "Unknown"}
                    </Text>
                    <Text style={styles.scoreText}>
                      Time:{" "}
                      {score.timeInSeconds != null
                        ? formattedTime(score.timeInSeconds)
                        : "N/A"}
                    </Text>
                  </View>
                ))}
            </View>
          ))
      ) : (
        <Text style={styles.noScores}>No scores yet!</Text>
      )}
    </ScrollView>
  );
};

export default ScoreList;
