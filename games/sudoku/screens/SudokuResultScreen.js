import React, { useState, useEffect, useMemo } from 'react'; 
import { View, Text, TouchableOpacity } from 'react-native'; 
import { useNickname } from '../../../context/context'; 
import { DifficultyModal } from '../components/Sudoku/Modals';
import FilterButtons from '../components/SudokuResult/FilterButtons'; 
import ScoreList from '../components/SudokuResult/ScoreList';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from '../styles/SudokuResultStyles';  
import { fetchScores, computePlayerRank, getTopScores } from '../Logic/SudokuResultLogic'; 

export default function SudokuResult({ route, navigation }) {
  // Haetaan  tuloksen aika ja vaikeustaso
  const { time, difficulty } = route.params;
  // Ladataan kirjastoista käyttäjänimi
  const { nickname } = useNickname();

  // Tilat: kaikki pisteet, valittu vaikeustaso listalla ja modaalin näkyvyys
  const [scores, setScores] = useState([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState(difficulty);
  const [showDifficultyModal, setShowDifficultyModal] = useState(false);

  // Kun näkymä aukeaa, haetaan tulokset Firebasesta
  useEffect(() => {
    fetchScores().then(setScores).catch(console.error);
  }, [navigation]);

  // Muuntaa sekunnit muotoon "m:ss"
  const formatTime = sec => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // Laskee oman sijoituksen kerran, kun aika tai parametrit muuttuvat
  const playerRank = useMemo(
    () => computePlayerRank(scores, difficulty, nickname, time),
    [scores, difficulty, nickname, time]
  );

  return (
    <View style={styles.container}>
      {/* Pääotsikko ja oman tuloksen tiedot */}
      <Text style={styles.title}>GAME OVER!</Text>
      <Text style={styles.title2}>Your result:</Text>
      <View style={styles.resultBox}>
        <Text style={styles.infoText}>Nickname: {nickname}</Text>
        <Text style={styles.infoText}>Difficulty: {difficulty}</Text>
        <Text style={styles.infoText}>
          Time: {time != null ? formatTime(time) : 'N/A'}
        </Text>
        {/* Näytä sijoitus, jos löytyy */}
        {playerRank && (
          <Text style={styles.infoText}>Ranking: #{playerRank}</Text>
        )}
      </View>

      {/* Kotinappi ja pelin uudelleen aloitus */}
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

      {/* Top 10 -listan otsikko ja EASY-, MEDIUM- ja HARD- suodatinnapit */}
      <Text style={styles.subtitle}>Top 10 list:</Text>
      <FilterButtons
        selected={selectedDifficulty}
        onSelect={setSelectedDifficulty}
      />

      {/* Näytetään tulokset valitulla vaikeustasolla */}
      <ScoreList
        scores={scores}
        difficulty={selectedDifficulty}
        formatTime={formatTime}
      />

      {/* Modal pelin uudelleenpelausta varten */}
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
