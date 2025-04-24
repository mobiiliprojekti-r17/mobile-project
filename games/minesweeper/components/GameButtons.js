import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from "../styles/minesweeperStyles";
// näytön alareunan napit
const GameButtons = ({ onInfoPress,  onRestartPress,  onHomePress,  onResultsPress,   showResults }) => (
  <View style={styles.buttonContainer}>
    {/* Ohjeet */}
    <TouchableOpacity style={styles.button} onPress={onInfoPress}>
      <MaterialCommunityIcons name="information" size={20} color='#fff' />
      <Text style={styles.buttonText}>Info</Text>
    </TouchableOpacity>

    {/* Uudelleen aloitus */}
    <TouchableOpacity style={styles.button} onPress={onRestartPress}>
      <MaterialCommunityIcons name="restart" size={20} color="#fff" />
      <Text style={styles.buttonText}>Restart</Text>
    </TouchableOpacity>

    {/* Kotisivulle */}
    <TouchableOpacity style={styles.button} onPress={onHomePress}>
      <MaterialCommunityIcons name="home" size={20} color="#fff" />
      <Text style={styles.buttonText}>Home</Text>
    </TouchableOpacity>

    {/* Tulokset-nappi näkyy vain, jos peli on läpäisty*/}
    {showResults && (
      <TouchableOpacity style={styles.button} onPress={onResultsPress}>
        <MaterialCommunityIcons name="trophy-outline" size={20} color="#fff" />
        <Text style={styles.buttonText}>Results</Text>
      </TouchableOpacity>
    )}
  </View>
);

export default GameButtons;
