import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/minesweeperResultsStyles";
import { useNickname } from "../../../context/context";
import DifficultySelectorModal from "../Modals/difficultyModals";
import Icon from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ScoreList from "../components/ScoreList";
import { useFonts, VT323_400Regular } from "@expo-google-fonts/vt323";
import { formattedTime } from "../utils/Time";
import useScores from "../hooks/useScores";

const MinesweeperResultScreen = ({ route, navigation }) => {
  const [fontsLoaded] = useFonts({ VT323_400Regular });
  const { nickname } = useNickname();
  const { time, difficulty } = route.params;
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [playAgainModalVisible, setPlayAgainModalVisible] = useState(false);

  const { scores, loading, error } = useScores();

  if (!fontsLoaded) return null;
  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>Error loading scores.</Text>;

  const handlePlayAgainSelect = (newDifficulty) => {
    setPlayAgainModalVisible(false);
    navigation.navigate("Minesweeper", { difficulty: newDifficulty, nickname });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your result:</Text>
      <View style={styles.resultBox}>
        <Text style={styles.infoText}>Nickname: {nickname}</Text>
        <Text style={styles.infoText}>Difficulty: {difficulty}</Text>
        <Text style={styles.infoText}>
          Time: {time ? formattedTime(time) : "N/A"}
        </Text>
      </View>

      <View style={styles.resultButtonContainer}>
        <TouchableOpacity style={styles.Button} onPress={() => setPlayAgainModalVisible(true)}>
                <MaterialCommunityIcons name="restart" size={25} color="rgb(0, 105, 53)" />
          <Text style={styles.ButtonText}>Play Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.Button} onPress={() => navigation.navigate("Home")}>
              <MaterialCommunityIcons name="home" size={25} color="rgb(0, 105, 53)" />
              <Text style={styles.ButtonText}>Home</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title2}>Top list:</Text>

      <View style={styles.buttonContainer}>
        {["", "EASY", "MEDIUM", "HARD"].map((level) => (
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

      <ScoreList
  scores={scores}
  selectedDifficulty={selectedDifficulty}
  formattedTime={formattedTime}
/>


      <DifficultySelectorModal
        visible={playAgainModalVisible}
        onSelect={handlePlayAgainSelect}
        onCancel={() => setPlayAgainModalVisible(false)}
      />
    </View>
  );
};

export default MinesweeperResultScreen;