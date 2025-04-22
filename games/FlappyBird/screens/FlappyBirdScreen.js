import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Sky from '../components/Sky';
import FlappyBird from '../components/FlappyBird';
import { useFonts, Silkscreen_400Regular } from '@expo-google-fonts/silkscreen';
import FlappyStyles from '../FlappyStyles/FlappyBirdStyles';

export default function FlappyBirdScreen({ navigation }) {
  const [fontsLoaded] = useFonts({
    Silkscreen_400Regular,
  });

  if (!fontsLoaded) {
    return null; 
  }
  return (
    <View style={FlappyStyles.container}>
      <Sky />

      <View style={FlappyStyles.gameContainer}>
        <FlappyBird navigation={navigation} />
      </View>

      <View style={FlappyStyles.buttonContainer}>
        <TouchableOpacity
          style={FlappyStyles.HomeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={FlappyStyles.buttonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
