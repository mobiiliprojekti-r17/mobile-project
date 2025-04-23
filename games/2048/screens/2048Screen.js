// Tuodaan tarvittavat kirjastot ja komponentit
import React, { useState, useEffect, useRef } from "react"; 
import { View, Text, Alert, Button, Animated } from "react-native";
import { useNickname } from "../../../context/context";
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
  const { nickname, setNickname } = useNickname();

  // Tilamuuttujat pelin tilan ja animoitujen efektien hallintaan
  const [grid, setGrid] = useState(initializeGrid()); // pelilauta
  const [score, setScore] = useState(0); // pistemäärä
  const [time, setTime] = useState(0); // ajastin
  const [isGameActive, setIsGameActive] = useState(true); // onko peli käynnissä
  const [gameOverHandled, setGameOverHandled] = useState(false); // game over tarkistus
  const [swipeCooldown, setSwipeCooldown] = useState(false); // rajoittaa pyyhkäisyjä
  const [previousGrid, setPreviousGrid] = useState(null); // edellinen pelitila undo-napista
  const [previousScore, setPreviousScore] = useState(0); // edelliset pisteet
  const [newTile, setNewTile] = useState(null); // uusi laatta animaatioihin
  const [mergedTiles, setMergedTiles] = useState([]); // yhdistetyt laatat animaatioihin

  // Animaatioiden tilat
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const mergeAnim = useRef(new Animated.Value(1)).current;

  // Fontin lataus
  let [fontsLoaded] = useFonts({
    ChangaOne_400Regular,
  });

  // Asetetaan käyttäjänimi navigoinnin kautta, jos tulee parametreissa
  useEffect(() => {
    if (route.params?.nickname) {
      setNickname(route.params.nickname);
    }
  }, [route.params?.nickname]);

  // Käynnistetään ajastin pelin alkaessa
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

  // Tallennetaan tulokset Firebaseen kun peli päättyy
  useEffect(() => {
    if (isGameActive || gameOverHandled) return;

    const handleGameOver = async () => {
      setGameOverHandled(true);

      
      try {
        const gameResultsRef = collection(db, "2048Results");
        await addDoc(gameResultsRef, {
          Nickname: nickname || "Unknown",
          score: score,
          time: formatTime(time),
        });
        console.log("✅ Pelitulos tallennettu Firebaseen");
      } catch (error) {
        console.error("❌ Virhe tallennettaessa tulosta: ", error);
      }

      navigation.replace("Game2048ResultScreen", {
        nickname,
        score,
        time: formatTime(time),
      });
    };

    handleGameOver();
  }, [isGameActive]);

// Uuden laatan animaatio
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

  // Laattojen yhdistymisen animaatio
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

  // Ajan muotoilu mm:ss -muotoon
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Näytön pyyhkäisyjen käsittely ja ruudukon päivitys
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

    // Estetään liian nopeat pyyhkäisyt
    setTimeout(() => setSwipeCooldown(false), 150);
  };

  // Undo-toiminto
  const handleUndo = () => {
    if (previousGrid) {
      setGrid(previousGrid);
      setScore(previousScore);
      setPreviousGrid(null);
      setPreviousScore(null);
    }
  };

  // Pelin resetointi
  const resetGame = () => {
    setGrid(initializeGrid());
    setScore(0);
    setTime(0);
    setIsGameActive(true);
    setGameOverHandled(false);
  };

  // Jos fontti ei ole ladannut
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  // Varsinainen pelinäkymä
  return (
    <PanGestureHandler onGestureEvent={handleSwipe}>
      <View style={styles.container}>
        <Text style={[styles.ChangaOneText, { fontFamily: 'ChangaOne_400Regular' }]}>2048</Text>

        {/* Yläpalkki – koti ja undo */}
        <View style={styles.topButtonsContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate("Home")}>
            <Icon name="home" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={handleUndo}>
            <Icon name="corner-up-left" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        
        {/* Pistelaskuri ja ajastin */}
        <View style={styles.topBar}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.timerText}>Time: {formatTime(time)}</Text>
        </View>

        {/* Pelilauta */}
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