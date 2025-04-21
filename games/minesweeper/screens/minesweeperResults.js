import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/minesweeperResultsStyles";
import { useNickname } from "../../../context/context";
import DifficultySelectorModal from "../Modals/difficultyModals";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ScoreList from "../components/ScoreList";
import { useFonts, Bungee_400Regular } from "@expo-google-fonts/bungee";
import { formattedTime } from "../utils/Time";
import { fetchScores, computePlayerRank, getTopScores } from "../utils/ResultsUtils";

export default function MinesweeperResultScreen({ route, navigation }) {
  const [fontsLoaded] = useFonts({ Bungee_400Regular });
  const { nickname } = useNickname();
  const { time, difficulty } = route.params;
  const [scores, setScores] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchScores()
      .then(setScores)
      .catch(console.error);
  }, []);

  const playerRank = useMemo(
    () => computePlayerRank(scores, difficulty, nickname, time),
    [scores, difficulty, nickname, time]
  );

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your result:</Text>
      <View style={styles.resultBox}>
        <Text style={styles.infoText}>Nickname: {nickname}</Text>
        <Text style={styles.infoText}>Difficulty: {difficulty}</Text>
        <Text style={styles.infoText}>
          Time: {time ? formattedTime(time) : "N/A"}
        </Text>
        {playerRank && (
          <Text style={styles.infoText}>Ranking: #{playerRank}</Text>
        )}
      </View>

      <View style={styles.resultButtonContainer}>
        <TouchableOpacity
          style={styles.Button}
          onPress={() => setShowModal(true)}
        >
          <MaterialCommunityIcons
            name="restart"
            size={25}
            color="rgb(0,105,53)"
          />
          <Text style={styles.ButtonText}>Play Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.Button}
          onPress={() => navigation.navigate("Home")}
        >
          <MaterialCommunityIcons name="home" size={25} color="rgb(0,105,53)" />
          <Text style={styles.ButtonText}>Home</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title2}>Top 10 list:</Text>
      <View style={styles.buttonContainer}>
        {["EASY", "MEDIUM", "HARD"].map(level => (
          <TouchableOpacity
            key={level}
            style={[
              styles.filterButton,
              selectedDifficulty === level && styles.selectedButton,
            ]}
            onPress={() => setSelectedDifficulty(level)}
          >
            <Text style={styles.buttonText}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScoreList
        scores={getTopScores(scores, selectedDifficulty)}
        formattedTime={formattedTime}
      />

      <DifficultySelectorModal
        visible={showModal}
        onSelect={lvl => navigation.replace("Minesweeper", { difficulty: lvl, nickname })}
        onCancel={() => setShowModal(false)}
      />
    </View>
  );
}
