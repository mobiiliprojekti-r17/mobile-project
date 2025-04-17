import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Sky from '../components/Sky';
import FlappyBird from '../components/FlappyBird';
import FlappyStyles from '../FlappyStyles/FlappyStyles';

const styles = StyleSheet.create({
  ...FlappyStyles,

  container: {
    flex: 1,
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
});

export default function FlappyBirdScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Sky />

      <View style={styles.gameContainer}>
        <FlappyBird navigation={navigation} />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
