import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { db } from "../../../firebase/Config";
import { collection, getDocs, query } from "firebase/firestore";
import styles from "../styles/2048ResultStyles";
import { useNickname } from "../../../context/context";

export default function Game2048ResultScreen({ route, navigation }) {
  const { nickname } = useNickname();
  const { score, time } = route.params;
  const [scores, setScores] = useState([]);

  const convertTimeToSeconds = (timeString) => {
    if (typeof timeString === "string") {
      const timeParts = timeString.split(":" ).map(Number);
      if (timeParts.length === 2) {
        return timeParts[0] * 60 + timeParts[1];
      }
    }
    return 0;
  };

  const timeInSeconds = convertTimeToSeconds(time);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresQuery = query(collection(db, "2048Results"));
        const querySnapshot = await getDocs(scoresQuery);

        const scoresList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          if (data.time) {
            const timeParts = data.time.split(":" ).map(Number);
            data.timeInSeconds = (timeParts[0] || 0) * 60 + (timeParts[1] || 0);
          } else {
            data.timeInSeconds = 0;
          }
          return data;
        });

        scoresList.sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          return a.timeInSeconds - b.timeInSeconds;
        });

        setScores(scoresList);
      } catch (error) {
        console.error("Virhe tulosten hakemisessa: ", error);
      }
    };

    fetchScores();
  }, [navigation]);

  const formattedTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const secs = timeInSeconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>

      <View style={styles.resultBox}>
        <Text style={styles.infoText}>Player: {nickname}</Text>
        <Text style={styles.infoText}>Score: {score}</Text>
        <Text style={styles.infoText}>Time: {formattedTime(timeInSeconds)}</Text>
      </View>

      <Text style={styles.subtitle}>Top Scores:</Text>

      <ScrollView style={styles.scrollView}>
        {scores.length > 0 ? (
          scores.map((score, index) => (
            <View key={index} style={styles.scoreItem}>
              <View style={styles.rankContainer}>
                <Text style={styles.rank}>#{index + 1}</Text>
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.scoreText}>Player: {score.Nickname}</Text>
                <Text style={styles.scoreText}>Score: {score.score}</Text>
                <Text style={styles.scoreText}>Time: {formattedTime(score.timeInSeconds)}</Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noScores}>No scores yet!</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.homeButtonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}
