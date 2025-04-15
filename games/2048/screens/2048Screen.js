import React, { useState, useEffect, useRef } from "react"; 
import { View, Text, Alert, Button, Animated } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import { initializeGrid, moveTiles, checkGameOver } from "../utils/2048Logic";
import { styles, getTileStyle } from "../styles/2048Styles";
import Icon from "react-native-vector-icons/Feather";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { db, collection, addDoc } from "../../../firebase/Config";
import { useFonts } from 'expo-font';
import { ChangaOne_400Regular } from '@expo-google-fonts/changa-one';

const Game2048Screen = ({ route }) => {
  const navigation = useNavigation();
  const [Nickname, setNickname] = useState('');
  const [grid, setGrid] = useState(initializeGrid());
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [isGameActive, setIsGameActive] = useState(true);
  const [gameOverHandled, setGameOverHandled] = useState(false);
  const [swipeCooldown, setSwipeCooldown] = useState(false);
  const [previousGrid, setPreviousGrid] = useState(null);
  const [previousScore, setPreviousScore] = useState(0);
  const [newTile, setNewTile] = useState(null);
  const [mergedTiles, setMergedTiles] = useState([]);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const mergeAnim = useRef(new Animated.Value(1)).current;

  let [fontsLoaded] = useFonts({
    ChangaOne_400Regular,
  });

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
    if (isGameActive || gameOverHandled) return;

    const handleGameOver = async () => {
      setGameOverHandled(true);

      
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
  }, [isGameActive]);

  useEffect(() => {
    if (newTile) {
      scaleAnim.setValue(0.9);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  }, [newTile]);

  useEffect(() => {
    if (mergedTiles.length > 0) {
      mergeAnim.setValue(0.9);
      Animated.spring(mergeAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    }
  }, [mergedTiles]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSwipe = (event) => {
    if (swipeCooldown || !isGameActive || gameOverHandled) return;
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

    const { newGrid, totalPoints, newTile, mergedTiles } = moveTiles(grid, direction);
    setGrid([...newGrid]);
    setScore(score + totalPoints);
    setNewTile(newTile);
    setMergedTiles(mergedTiles);

    if (checkGameOver(newGrid)) {
      setIsGameActive(false);
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
    setGameOverHandled(false);
  };

  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <PanGestureHandler onGestureEvent={handleSwipe}>
      <View style={styles.container}>
        <Text style={[styles.ChangaOneText, { fontFamily: 'ChangaOne_400Regular' }]}>2048</Text>

        <View style={styles.topButtonsContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Home")}>
            <Icon name="home" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleUndo}>
            <Icon name="corner-up-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.topBar}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.timerText}>Time: {formatTime(time)}</Text>
        </View>

        <View style={styles.gridContainer}>
          {grid.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, cellIndex) => {
                const tileStyle = getTileStyle(cell);
                const isNew = newTile?.i === rowIndex && newTile?.j === cellIndex;
                const isMerged = mergedTiles.some(t => t.i === rowIndex && t.j === cellIndex);

                const animatedStyle = isNew
                  ? { transform: [{ scale: scaleAnim }] }
                  : isMerged
                  ? { transform: [{ scale: mergeAnim }] }
                  : {};

                const TileComponent = isNew || isMerged ? Animated.View : View;

                return (
                  <TileComponent
                    key={cellIndex}
                    style={[styles.tile, { backgroundColor: tileStyle.backgroundColor }, animatedStyle]}
                  >
                    <Text style={[styles.tileText, { color: tileStyle.color }]}>
                      {cell !== 0 ? cell : ""}
                    </Text>
                  </TileComponent>
                );
              })}
            </View>
          ))}
        </View>

      </View>
    </PanGestureHandler>
  );
};

export default Game2048Screen;