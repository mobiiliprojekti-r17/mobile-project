
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import FlappyBird from '../components/FlappyBird';
import FlappyStyles from '../FlappyStyles/FlappyStyles';

const styles = FlappyStyles;


const FlappyBirdScreen = ({ navigation }) => {
    return (
      <View style={styles.container}>
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
