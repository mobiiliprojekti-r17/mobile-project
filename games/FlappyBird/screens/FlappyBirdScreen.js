import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MatterGameEngine from '../components/FlappyBirdMatter';
import StartGame from '../components/StartGame';
import GameOver from '../components/GameOver';

const FlappyBirdScreen = ({ navigation }) => {
  const [running, setRunning] = useState(false);
  const [overlayType, setOverlayType] = useState("start");
  const [score, setScore] = useState(0);
  const [gameKey, setGameKey] = useState(0); 

  const onGameOver = () => {
    setRunning(false);
    setOverlayType("gameover");
  };

  const startGame = () => {
    setScore(0);
    setOverlayType(null);
    setRunning(true);
    setGameKey(prev => prev + 1);
  };

  const resetGame = () => {
    setScore(0);
    setOverlayType(null);
    setRunning(true);
    setGameKey(prev => prev + 1);
  };

  return (
    <View style={{ flex: 1 }}>
      <MatterGameEngine
        key={gameKey}  
        running={running}
        onGameOver={onGameOver}
        onEvent={(e) => {
          if (e.type === 'score') {
            setScore((prevScore) => prevScore + 1);
          }
        }}
      />
      {overlayType === "start" && (
        <TouchableOpacity style={styles.overlay} onPress={startGame}>
          <StartGame />
        </TouchableOpacity>
      )}
      {overlayType === "gameover" && (
        <TouchableOpacity style={styles.overlay} onPress={resetGame}>
          <GameOver />
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
      <Text style={styles.score}>{score}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  homeButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 11,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  score: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    zIndex: 11,
  },
});

export default FlappyBirdScreen;

