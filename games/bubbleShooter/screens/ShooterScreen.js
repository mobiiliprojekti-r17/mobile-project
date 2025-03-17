import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import GameBoard from '../components/ShooterBoard';

const GameScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <GameBoard />
      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 40,
    },
    button: {
      paddingTop: 20  // Lisää etäisyyttä napin yläpuolelle
    },
  });
  
  export default GameScreen;