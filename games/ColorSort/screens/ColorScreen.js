import React from "react";
import { View } from 'react-native';
import ColorBoard from "../components/ColorBoard"; // Pääkomponentti, joka piirtää väripullopelin logiikan
import styles from "../styles/Styles";            // Päänäkymän tyylit

const ColorGame = () => {
  return (
    // Kääre, joka asettaa taustan ja keskittää pelin
    <View style={styles.container}>
      {/* Itse pelilauta, jossa pullot ja logiikka */}
      <ColorBoard />
    </View>
  );
};

export default ColorGame;
