import React, { useState } from "react";
import { View, Text, Alert } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { initializeGrid, moveTiles, checkGameOver } from "../utils/2048Logic";
import { styles, getTileStyle } from "../styles/2048Styles";

const Game2048Screen = () => {
  const [grid, setGrid] = useState(initializeGrid());
  const [swipeCooldown, setSwipeCooldown] = useState(false); // Estetään moninkertaiset pyyhkäisyt

  const handleSwipe = (event) => {
    if (swipeCooldown) return; // Jos throttle on päällä, estetään uusi siirto
    setSwipeCooldown(true); // Aktivoidaan throttle

    const { translationX, translationY } = event.nativeEvent;
    let direction = null;

    if (Math.abs(translationX) > Math.abs(translationY)) {
      direction = translationX > 0 ? "right" : "left";
    } else {
      direction = translationY > 0 ? "down" : "up";
    }

    const newGrid = moveTiles(grid, direction);
    setGrid([...newGrid]);

    if (checkGameOver(newGrid)) {
      Alert.alert("Peli päättyi!", "Ei enää mahdollisia siirtoja!");
    }

    setTimeout(() => setSwipeCooldown(false), 150); // Vapautetaan throttle 150ms jälkeen
  };

  return (
    <PanGestureHandler onGestureEvent={handleSwipe}>
      <View style={styles.container}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, cellIndex) => {
              const tileStyle = getTileStyle(cell);
              return (
                <View
                  key={cellIndex}
                  style={[styles.tile, { backgroundColor: tileStyle.backgroundColor }]}
                >
                  <Text style={[styles.tileText, { color: tileStyle.color }]}>
                    {cell !== 0 ? cell : ""}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </PanGestureHandler>
  );
};

export default Game2048Screen;
