import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { db } from "../../../firebase/Config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import styles from "../styles/minesweeperResultsStyles";
import { useNickname } from "../../../context/context";
import DifficultySelectorModal from "../components/difficultyModals";
import Icon from "react-native-vector-icons/Feather";

export default function SudokuResult({ route, navigation }) {
  const { nickname } = useNickname();
  const { time, difficulty } = route.params;
  const [scores, setScores] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [playAgainModalVisible, setPlayAgainModalVisible] = useState(false);

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
            data.timeInSeconds =
              parseInt(timeParts[0], 10) * 60 + parseInt(timeParts[1], 10);
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

  // Kutsutaan, kun käyttäjä valitsee uuden vaikeustason modalista
  const handlePlayAgainSelect = (newDifficulty) => {
    setPlayAgainModalVisible(false);
    navigation.navigate("Minesweeper", {
      difficulty: newDifficulty,
      nickname,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GAME OVER!</Text>
      <Text style={styles.title2}>Your result:</Text>
      <View style={styles.resultBox}>
        <Text style={styles.infoText}>Nickname: {nickname}</Text>
        <Text style={styles.infoText}>Difficulty: {difficulty}</Text>
        <Text style={styles.infoText}>
          Time: {time ? formattedTime(time) : "N/A"}
        </Text>
      </View>

      {/* Napit oman tuloksen alapuolella, ennen toplistaa.
          Ensimmäisenä "Play Again", sen jälkeen "Home" */}
      <View style={styles.resultButtonContainer}>
        <TouchableOpacity
          style={styles.Button}
          onPress={() => setPlayAgainModalVisible(true)}
        >
          <Text style={styles.ButtonText}>Play Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.Button}
          onPress={() => navigation.navigate("Home")}
        >
          <Icon name="home" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title2}>Top list:</Text>

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
            .filter(
              (diffLevel) => !selectedDifficulty || diffLevel === selectedDifficulty
            )
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

      {/* Modal: Valitse vaikeustaso uudelleen pelatakseen */}
      <DifficultySelectorModal
        visible={playAgainModalVisible}
        onSelect={handlePlayAgainSelect}
        onCancel={() => setPlayAgainModalVisible(false)}
      />
    </View>
  );
}
