import React from 'react';
import { View, StyleSheet } from 'react-native';
import FlappyBird from '../components/FlappyBird';
const FlappyBirdScreen = () => {
  return (
    <View style={styles.container}>
      <FlappyBird />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default FlappyBirdScreen;
