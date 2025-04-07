import React, { useState, useEffect } from "react";
import { View, Text, Alert, Button } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { initializeGrid, moveTiles, checkGameOver } from "../utils/2048Logic";
import { styles, getTileStyle } from "../styles/2048Styles";
import Icon from "react-native-vector-icons/Feather";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db, collection, addDoc } from "../../../firebase/Config"

const Game2048Screen = ({ route }) => {
  const navigation = useNavigation();
  const [Nickname, setNickname] = useState('');
  const [grid, setGrid] = useState(initializeGrid());
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true);
  const [gameOverHandled, setGameOverHandled] = useState(false); // Estää kaksoistallennukset
  const [swipeCooldown, setSwipeCooldown] = useState(false);

  const [previousGrid, setPreviousGrid] = useState(null);
  const [previousScore, setPreviousScore] = useState(0);

  useEffect(() => {
    if (route.params?.nickname) {
      setNickname(route.params.nickname);
    }
  }, [route.params?.nickname]);

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

  useEffect(() => {
    if (isGameActive || gameOverHandled) return; // Estetään ylimääräiset kutsut

    const handleGameOver = async () => {
      setGameOverHandled(true); // Estetään uudelleenkutsuminen

      try {
        const gameResultsRef = collection(db, "2048Results");
        await addDoc(gameResultsRef, {
          Nickname: Nickname,
          score: score,
          time: formatTime(time),
        });
        console.log("✅ Pelitulos tallennettu Firebaseen");
      } catch (error) {
        console.error("❌ Virhe tallennettaessa tulosta: ", error);
      }

      navigation.replace("Game2048ResultScreen", {
        Nickname,
        score,
        time: formatTime(time),
      });
    };

    handleGameOver();
  }, [isGameActive]); // Käynnistyy vain kun peli loppuu

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSwipe = (event) => {
    if (swipeCooldown || !isGameActive || gameOverHandled) return; // Estää ylimääräiset siirrot
    setSwipeCooldown(true);

    const { translationX, translationY } = event.nativeEvent;
    let direction =
      Math.abs(translationX) > Math.abs(translationY)
        ? translationX > 0
          ? "right"
          : "left"
        : translationY > 0
        ? "down"
        : "up";

    setPreviousGrid([...grid]);
    setPreviousScore(score);

    const { newGrid, totalPoints } = moveTiles(grid, direction);
    setGrid([...newGrid]);
    setScore(score + totalPoints);

    if (checkGameOver(newGrid)) {
      setIsGameActive(false); // Tämä aktivoi useEffectin tallentamaan tuloksen
    }

    setTimeout(() => setSwipeCooldown(false), 150);
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
    setGameOverHandled(false); // Nollataan tila uuden pelin alkaessa
  };

  return (
    <PanGestureHandler onGestureEvent={handleSwipe}>
      <View style={styles.container}>
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
                <View
                  key={cellIndex}
                  style={[styles.tile, { backgroundColor: tileStyle.backgroundColor }]} >
                  <Text style={[styles.tileText, { color: tileStyle.color }]}>
                    {cell !== 0 ? cell : ""}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Home")}>
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>
      </View>
    </PanGestureHandler>
  );
};

export default Game2048Screen;
