import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, TouchableOpacity } from "react-native";
import { db } from "../../../firebase/Config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import styles from "../styles/minesweeperResultsStyles";
import { useNickname } from "../../../context/context";

export default function SudokuResult({ route, navigation }) {
  const { nickname } = useNickname()
  const { time, difficulty } = route.params;
  const [scores, setScores] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresQuery = query(
          collection(db, "MinesweeperResults"),
          orderBy("time")
        );

        const querySnapshot = await getDocs(scoresQuery);
        const scoresList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          if (data.time) {
            const timeParts = data.time.split(":");
            data.timeInSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]);
          } else {
            data.timeInSeconds = 0;
          }
          return data;
        });
        setScores(scoresList);
      } catch (error) {
        console.error("Virhe tulosten hakemisessa: ", error);
      }
    };

    fetchScores();
  }, [navigation]);


  const formattedTime = (timeInSeconds) => {
    if (timeInSeconds == null) return "N/A";
    const minutes = Math.floor(timeInSeconds / 60);
    const secs = timeInSeconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const groupedScores = scores.reduce((acc, score) => {
    if (!acc[score.difficulty]) acc[score.difficulty] = [];
    acc[score.difficulty].push(score);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GAME OVER!</Text>
      <Text style={styles.title}>Your result:</Text>
      <View style={styles.resultBox}>
        <Text style={styles.infoText}>Nickname: {nickname}</Text>
        <Text style={styles.infoText}>Difficulty: {difficulty}</Text>
        <Text style={styles.infoText}>Time: {time ? formattedTime(time) : "N/A"}</Text>
      </View>

      <Text style={styles.subtitle}>Top list:</Text>

      <View style={styles.buttonContainer}>
        {["", "easy", "medium", "hard"].map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.filterButton,
              selectedDifficulty === level && styles.selectedButton,
            ]}
            onPress={() => setSelectedDifficulty(level)}
          >
            <Text style={styles.buttonText}>
              {level === "" ? "Show all" : level.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scrollView}>
        {Object.keys(groupedScores).length > 0 ? (
          Object.keys(groupedScores)
            .filter((diffLevel) => !selectedDifficulty || diffLevel === selectedDifficulty)
            .map((diffLevel) => (
              <View key={diffLevel} style={styles.difficultySection}>
                <Text style={styles.difficultyTitle}>
                  {diffLevel ? diffLevel.toUpperCase() : "ALL"}
                </Text>
                {groupedScores[diffLevel]
                  .sort((a, b) => a.timeInSeconds - b.timeInSeconds)
                  .map((score, index) => (
                    <View key={index} style={styles.scoreItem}>
                      <Text style={styles.rank}>#{index + 1}</Text>
                      <Text style={styles.scoreText}>
                        Nickname: {score.Nickname ?? "Unknown"}
                      </Text>
                      <Text style={styles.scoreText}>
                        Difficulty: {score.difficulty ?? "Unknown"}
                      </Text>
                      <Text style={styles.scoreText}>
                        Time: {score.timeInSeconds != null ? formattedTime(score.timeInSeconds) : "N/A"}
                      </Text>
                    </View>
                  ))}
              </View>
            ))
        ) : (
          <Text style={styles.noScores}>No scores yet!</Text>
        )}
      </ScrollView>

      <Button title="Home" onPress={() => navigation.navigate("Home")} color="#6200EE" />
    </View>
  );
}
