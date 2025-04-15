import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import BrickBreaker from '../components/BrickBreaker';
import BreakerStyles from '../styles/BreakerStyles';

const BrickBreakerScreen = ({ navigation }) => {
  return (
    <View style={BreakerStyles.container}>
      <View style={BreakerStyles.gameContainer}>
        <BrickBreaker navigation={navigation} />
      </View>
      <View style={BreakerStyles.buttonContainer}>
        <TouchableOpacity style={BreakerStyles.homeButton} onPress={() => navigation.navigate("Home")}>
          <Text style={BreakerStyles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BrickBreakerScreen;
