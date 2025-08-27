import React from 'react';                        
import { ScrollView, View, Text } from 'react-native';  
import styles from '../../styles/SudokuResultStyles'; 
import ScoreItem from './ScoreItem';   

export default function ScoreList({ scores, difficulty, formatTime }) {
  // Suodatetaan pisteet valitun vaikeustason mukaan, lajitellaan aikajärjestyksessä lyhin aika ensin ja otetaan top 10
  const list = scores
    .filter(s => s.difficulty === difficulty)
    .sort((a, b) => a.timeInSeconds - b.timeInSeconds)
    .slice(0, 10);

  // Jos listassa ei ole pisteitä, näytetään viesti
  if (!list.length) {
    return (
      <Text style={styles.noScores}>
        No scores yet for {difficulty}
      </Text>
    );
  }

  // Muussa tapauksessa näytetään vieritettävä lista top 10 tuloksista firebasesta
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
