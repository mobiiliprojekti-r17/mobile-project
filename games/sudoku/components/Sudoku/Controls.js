import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../../styles/SudokuStyles";

export default function Controls({ onHome, onRestart }) {
  return (
    <View style={styles.ButtonContainer}>
      <TouchableOpacity style={styles.Homebutton} onPress={onHome}>
        <MaterialCommunityIcons name="home" size={25} color="#fff" />
        <Text style={styles.HomebuttonText}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.Restartbutton} onPress={onRestart}>
        <MaterialCommunityIcons name="restart" size={25} color="#fff" />
        <Text style={styles.RestartbuttonText}>Restart</Text>
      </TouchableOpacity>
    </View>
  );
}
