import React from 'react';
import { View, Text, Button, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  
  const newSudokuGame = () => {
    Alert.alert(
      "Choose difficulty",
      "",
      [
        { text: "Easy", onPress: () => startSudokuGame("easy") },
        { text: "Medium", onPress: () => startSudokuGame("medium") },
        { text: "Hard", onPress: () => startSudokuGame("hard") },
      ],
      { cancelable: false }
    );
  };

  const startSudokuGame = (difficulty) => {
    navigation.navigate("Sudoku", { difficulty, autoStart: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Game!</Text>
      
      {/* 2048 linkki */}
      <TouchableOpacity 
        style={styles.gameButton} 
        onPress={() => navigation.navigate("2048")}
      >
        <Text style={styles.gameButtonText}>2048</Text>
      </TouchableOpacity>

      {/* Muut pelilinkit */}
      <Button
        title="Bubble Shooter"
        onPress={() => navigation.navigate('GameScreen')}
      />
      <Button
        title="Brick Breaker"
        onPress={() => navigation.navigate('BrickBreaker')}
      />
      <TouchableOpacity style={styles.gameButton} onPress={newSudokuGame}>
        <Text style={styles.gameButtonText}>Sudoku</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  gameButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  gameButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default HomeScreen;
