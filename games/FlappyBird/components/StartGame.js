import React from 'react';
import { View, Text } from 'react-native';
import gameStyles from '../styles/GameStyles';

const StartGame = () => {
  return (
    <View style={gameStyles.startGameContainer}>
      <Text style={gameStyles.startGameText}>Start Game</Text>
    </View>
  );
};

export default StartGame;
