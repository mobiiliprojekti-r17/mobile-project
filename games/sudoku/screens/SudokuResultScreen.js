import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useFonts, RobotoMono_400Regular } from '@expo-google-fonts/roboto-mono';
import { useNickname } from '../../../context/context';
import {DifficultyModal} from '../components/Sudoku/Modals';
import FilterButtons from '../components/SudokuResult/FilterButtons';
import ScoreList from '../components/SudokuResult/ScoreList';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/SudokuResultStyles';
import { fetchScores, computePlayerRank, getTopScores } from '../Logic/SudokuResultLogic';

export default function SudokuResult({ route, navigation }) {
  const [fontsLoaded] = useFonts({ RobotoMono_400Regular });
  const { nickname } = useNickname();
  const { time, difficulty } = route.params;

  const [scores, setScores] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  useEffect(() => {
    fetchScores().then(setScores).catch(console.error);
  }, [navigation]);

  const formatTime = sec => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const playerRank = useMemo(() =>
    computePlayerRank(scores, difficulty, nickname, time),
  [scores, difficulty, nickname, time]);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GAME OVER!</Text>
      <Text style={styles.title2}>Your result:</Text>
      <View style={styles.resultBox}>
        <Text style={styles.infoText}>Nickname: {nickname}</Text>
        <Text style={styles.infoText}>Difficulty: {difficulty}</Text>
        <Text style={styles.infoText}>Time: {time != null ? formatTime(time) : 'N/A'}</Text>
        {playerRank && (
          <Text style={styles.infoText}>Ranking: #{playerRank}</Text>
        )}
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.Homebutton}
          onPress={() => navigation.navigate('Home')}
        >
          <MaterialCommunityIcons name="home" size={25} color="#000" />
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.PlayAgainButton}
          onPress={() => setShowDifficultyModal(true)}
        >
          <MaterialCommunityIcons name="restart" size={25} color="#000" />
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Top 10 list:</Text>
      <FilterButtons
        selected={selectedDifficulty}
        onSelect={setSelectedDifficulty}
      />
      <ScoreList
        scores={scores}
        difficulty={selectedDifficulty}
        formatTime={secs =>
          `${Math.floor(secs/60)}:${secs%60<10?'0':''}${secs%60}`
        }
      />

      <DifficultyModal
        visible={showDifficultyModal}
        onSelectDifficulty={level => {
          setShowDifficultyModal(false);
          navigation.replace('Sudoku', { difficulty: level, nickname });
        }}
        onClose={() => setShowDifficultyModal(false)}
      />
    </View>
  );
}
