import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MatterGameEngine from '../components/FlappyBirdMatter';

const FlappyBirdScreen = ({ navigation }) => {
  const [running, setRunning] = useState(true);

  const onGameOver = () => {
    setRunning(false);
  };

  const resetGame = () => {
    // Resetoi peli käynnistämällä MatterGameEngine uudelleen
    setRunning(true);
  };

  return (
    <View style={{ flex: 1 }}>
      <MatterGameEngine running={running} onGameOver={onGameOver} resetGame={resetGame} />
      <TouchableOpacity style={styles.Homebutton} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  Homebutton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FlappyBirdScreen;
