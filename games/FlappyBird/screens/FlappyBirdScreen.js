// Tuodaan React, React Native -komponentit ja omat pelikomponentit
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Sky from '../components/Sky';                // Taustan pilvi- ja aurinkianimaatio
import FlappyBird from '../components/FlappyBird';  // Pelilogiikka ja fysiikkamoottori
import { useFonts, Silkscreen_400Regular } from '@expo-google-fonts/silkscreen';
import FlappyStyles from '../FlappyStyles/FlappyBirdStyles'; // Tyylitiedosto

/**
 * FlappyBirdScreen-komponentti: yhdistää taustan, pelikentän ja navigointinapin
 * @param {object} navigation - React Navigation -prop, jolla hallitaan siirtymiä
 */
export default function FlappyBirdScreen({ navigation }) {
  // Lataa fontti ennen näytön renderöintiä
  const [fontsLoaded] = useFonts({
    Silkscreen_400Regular,
  });

  // Jos fontit eivät ole vielä ladattu, palautetaan null (tyhjä näyttö)
  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={FlappyStyles.container}>
      {/* Sky-komponentti renderöi taivaan animaatiot */}
      <Sky />

      {/* GameContainer: sisältää varsinaisen FlappyBird-pelikomponentin */}
      <View style={FlappyStyles.gameContainer}>
        <FlappyBird navigation={navigation} />
      </View>

      {/* Alareunan nappi, jolla pääsee kotinäkymään */}
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