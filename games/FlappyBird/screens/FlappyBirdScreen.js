import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MatterGameEngine from '../components/FlappyBirdMatter';
import StartGame from '../components/StartGame';
import GameOver from '../components/GameOver';

const FlappyBirdScreen = ({ navigation }) => {
  const [running, setRunning] = useState(false);
  const [overlayType, setOverlayType] = useState("start"); 

  const onGameOver = () => {
    setRunning(false);
    setOverlayType("gameover");
  };


  const startGame = () => {
    setOverlayType(null);
    setRunning(true);
  };

  const resetGame = () => {
    setRunning(true);
    setOverlayType(null);
  };

  return (
    <View style={{ flex: 1 }}>
      <MatterGameEngine running={running} onGameOver={onGameOver} resetGame={resetGame} />
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
      <TouchableOpacity style={styles.Homebutton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

//styleseihin sitten kun jaksaa
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  Homebutton: {
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
});

export default FlappyBirdScreen;
