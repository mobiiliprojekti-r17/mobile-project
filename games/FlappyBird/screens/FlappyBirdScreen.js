import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import FlappyBird from '../components/FlappyBird';
import FlappyStyles from '../FlappyStyles/FlappyStyles';
import Sky from '../components/Sky';

const styles = FlappyStyles;

const FlappyBirdScreen = ({ navigation }) => {
  return (
    <View style={[styles.container, { backgroundColor: 'transparent' }]}>
      <Sky />
      <View style={styles.gameContainer}>
        <FlappyBird navigation={navigation} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FlappyBirdScreen;
