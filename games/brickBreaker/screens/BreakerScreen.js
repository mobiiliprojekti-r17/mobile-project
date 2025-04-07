import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import BrickBreaker from '../components/BrickBreaker';
import styles from '../styles/BreakerStyles';

const BrickBreakerScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.gameContainer}>
        <BrickBreaker navigation={navigation} />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BrickBreakerScreen;
