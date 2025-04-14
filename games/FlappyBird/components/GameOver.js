import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import gameStyles from '../styles/GameStyles';

const GameOver = () => {
  return (
    <View style={gameStyles.gameOver}>
      <Text style={gameStyles.gameOverText}>Game Over</Text>
      <Text style={gameStyles.restart}>Tap to Restart</Text>
    </View>
  );
};

export default GameOver;
