import React, { useState, useEffect, useMemo } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/minesweeperResultsStyles";
import { useNickname } from "../../../context/context";   
import DifficultySelectorModal from "../Modals/difficultyModals"; 
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ScoreList from "../components/ScoreList";   
import { formattedTime } from "../utils/Time";    
import { fetchScores, computePlayerRank, getTopScores } from "../utils/ResultsUtils"; 

export default function MinesweeperResultScreen({ route, navigation }) {
  // Haetaan pelaajan nimi kontekstista
  const { nickname } = useNickname();
  // Aikaparameetrit ja vaikeustaso tulosnäkymälle
  const { time, difficulty } = route.params;

  // Tilat pisteille ja valitulle vaikeustasolle
  const [scores, setScores] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);

  // Näytä/piilota vaikeustason valintalomake
  const [showModal, setShowModal] = useState(false);

  // Haetaan tulokset Firebase‑kokoelmasta
  useEffect(() => {
    fetchScores()
      .then(setScores)
      .catch(console.error);
  }, []);

  // Laskee oman sijoituksen aina, kun scores, difficulty, nickname tai time muuttuu
  const playerRank = useMemo(
    () => computePlayerRank(scores, difficulty, nickname, time),
    [scores, difficulty, nickname, time]
  );

  return (
    <View style={styles.container}>
      {/* Oma tulos */}
      <Text style={styles.title}>Your result:</Text>
      <View style={styles.resultBox}>
        <Text style={styles.infoText}>Nickname: {nickname}</Text>
        <Text style={styles.infoText}>Difficulty: {difficulty}</Text>
        <Text style={styles.infoText}>
          Time: {time ? formattedTime(time) : "N/A"}
        </Text>
        {/* Näytetään sijoitus */}
        {playerRank && (
          <Text style={styles.infoText}>Ranking: #{playerRank}</Text>
        )}
      </View>

      {/* Toimintonapit: Pelaauudelleen tai palaa kotivalikkoon */}
      <View style={styles.resultButtonContainer}>
        <TouchableOpacity
          style={styles.Button}
          onPress={() => setShowModal(true)}   // Avaa tasonvalinta-modalin
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
          onPress={() => navigation.navigate("Home")} // Palaa päävalikkoon
        >
          <MaterialCommunityIcons name="home" size={25} color="rgb(0,105,53)" />
          <Text style={styles.ButtonText}>Home</Text>
        </TouchableOpacity>
      </View>

      {/* Top 10 -otsikko ja vaikeustason suodattimet */}
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

      {/* Näyttää top‑pelaajat valitulla vaikeustasolla */}
      <ScoreList
        scores={getTopScores(scores, selectedDifficulty)}
        formattedTime={formattedTime}
      />

      {/* Modaalilomake vaikeustason vaihtoon */}
      <DifficultySelectorModal
        visible={showModal}
        onSelect={lvl =>
          navigation.replace("Minesweeper", { difficulty: lvl, nickname })
        }
        onCancel={() => setShowModal(false)}
      />
    </View>
  );
}
