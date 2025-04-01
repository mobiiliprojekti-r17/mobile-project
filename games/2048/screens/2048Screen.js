import React, { useState, useEffect } from "react";
import { View, Text, Alert, Button } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { initializeGrid, moveTiles, checkGameOver } from "../utils/2048Logic";
import { styles, getTileStyle } from "../styles/2048Styles";
import Icon from "react-native-vector-icons/Feather";
import { TouchableOpacity } from "react-native";

const Game2048Screen = () => {
  const [grid, setGrid] = useState(initializeGrid());
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true);
  const [swipeCooldown, setSwipeCooldown] = useState(false);
  
  // Tallennetaan edellinen tila peruutusta varten
  const [previousGrid, setPreviousGrid] = useState(null);
  const [previousScore, setPreviousScore] = useState(0);

  useEffect(() => {
    let timer;
    if (isGameActive) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isGameActive]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSwipe = (event) => {
    if (swipeCooldown || !isGameActive) return;
    setSwipeCooldown(true);

    const { translationX, translationY } = event.nativeEvent;
    let direction = Math.abs(translationX) > Math.abs(translationY) ? 
                    (translationX > 0 ? "right" : "left") : 
                    (translationY > 0 ? "down" : "up");

    // Tallennetaan edellinen ruudukko ja pisteet ennen siirtoa
    setPreviousGrid([...grid]);
    setPreviousScore(score);

    const { newGrid, totalPoints } = moveTiles(grid, direction);
    setGrid([...newGrid]);
    setScore(score + totalPoints);

    if (checkGameOver(newGrid)) {
      setIsGameActive(false);
      Alert.alert(
        "Game over!",
        `Score: ${score}\nTime: ${formatTime(time)}`,
        [{ text: "OK", onPress: resetGame }]
      );
    }

    setTimeout(() => setSwipeCooldown(false), 150);
  };

  // Peru siirto -toiminto palauttaa edellisen ruudukon ja pisteet
  const undoMove = () => {
    if (previousGrid) {
      setGrid(previousGrid);
      setScore(previousScore);
      setPreviousGrid(null); // Nollataan edellinen tila, jotta ei voi perua toistuvasti
    }
  };

  const handleUndo = () => {
    if (previousGrid) {
      setGrid(previousGrid);
      setScore(previousScore);
      setPreviousGrid(null);
      setPreviousScore(null);
    }
  };
  
  const resetGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setTime(0);
    setIsGameActive(true);
    setPreviousGrid(null); // Nollataan myös edellinen tila pelin resetoinnin yhteydessä
  };

  return (
    <PanGestureHandler onGestureEvent={handleSwipe}>
      <View style={styles.container}>
        {/* Undo-nappi */}
        <TouchableOpacity style={styles.undoButtonContainer} onPress={handleUndo}>
          <Icon name="corner-up-left" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.topBar}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.timerText}>Time: {formatTime(time)}</Text>
        </View>

        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cell, cellIndex) => {
              const tileStyle = getTileStyle(cell);
              return (
                <View key={cellIndex} style={[styles.tile, { backgroundColor: tileStyle.backgroundColor }]}>
                  <Text style={[styles.tileText, { color: tileStyle.color }]}>{cell !== 0 ? cell : ""}</Text>
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
