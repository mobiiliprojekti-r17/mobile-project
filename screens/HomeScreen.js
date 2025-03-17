import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Game!</Text>
      {/* Painikkeet eri peleille */}
      <Button
        title="Bubble Shooter"
        onPress={() => navigation.navigate('GameScreen')}
      />
      <Button
        title="Brick Breaker"
        onPress={() => navigation.navigate('BrickBreaker')}
      />
      <Button
        title="Sudoku"
        onPress={() => navigation.navigate('Sudoku')}
      />
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
});

export default HomeScreen;
