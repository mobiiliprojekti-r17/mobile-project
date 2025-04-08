import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { db, collection, addDoc } from '../firebase/Config';
import styles from "../styles/HomeScreenStyles";
import { useNickname } from '../context/context';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

const HomeScreen = ({ navigation }) => {
  const { nickname, setNickname } = useNickname();
  const [nicknames, setNicknames] = useState([]);

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  if (!fontsLoaded) return null;

  const addNickname = async () => {
    if (!nickname.trim()) {
      Alert.alert("Error", "Nickname cannot be empty!");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "NicknameList"), { Nickname: nickname });
      setNicknames((prevNicknames) => [...prevNicknames, { id: docRef.id, Nickname: nickname }]);
      Alert.alert("Success", "Nickname saved!");
    } catch (error) {
      Alert.alert("Error", "Failed to save nickname: " + error.message);
      console.error("Firestore error:", error);
    }
  };

  const startGame = (game, difficulty) => {
    navigation.navigate(game, { nickname, difficulty, autoStart: true });
  };

  const checkNicknameAndProceed = (callback) => {
    if (!nickname.trim()) {
      Alert.alert("Warning", "Please enter a nickname first!");
    } else {
      callback();
    }
  };

  const newSudokuGame = () => {
    checkNicknameAndProceed(() => {
      Alert.alert("Choose difficulty", "", [
        { text: "Easy", onPress: () => startGame("Sudoku", "easy") },
        { text: "Medium", onPress: () => startGame("Sudoku", "medium") },
        { text: "Hard", onPress: () => startGame("Sudoku", "hard") },
        { text: "Cancel", style: "cancel" },
      ]);
    });
  };

  const new2048Game = () => checkNicknameAndProceed(() => navigation.navigate("2048", { nickname }));
  const startBubbleShooter = () => checkNicknameAndProceed(() => navigation.navigate("BubbleShooter"));
  const startBrickBreaker = () => checkNicknameAndProceed(() => navigation.navigate("BrickBreaker"));
  const startMinesweeper = () => {
    checkNicknameAndProceed(() => {
      Alert.alert("Choose difficulty", "", [
        { text: "Easy", onPress: () => startGame("Minesweeper", "easy") },
        { text: "Medium", onPress: () => startGame("Minesweeper", "medium") },
        { text: "Hard", onPress: () => startGame("Minesweeper", "hard") },
        { text: "Cancel", style: "cancel" },
      ]);
    });
  };

  return (
    <View style={styles.fullScreen}>
      <View style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, { fontFamily: 'PressStart2P_400Regular' }]}>GameBits</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your nickname"
            value={nickname}
            onChangeText={setNickname}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={addNickname}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => setNickname('')}>
              <Text style={styles.buttonText}>Clear</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gameSection}>
            <Text style={styles.sectionTitle}>Singleplayer games!</Text>
            <TouchableOpacity style={styles.g2048Button} onPress={new2048Game}>
              <Text style={styles.gameButtonText}>2048</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ShooterButton} onPress={startBubbleShooter}>
              <Text style={styles.gameButtonText}>BubbleShooter</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.BreakerButton} onPress={startBrickBreaker}>
              <Text style={styles.gameButtonText}>BrickBreaker</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.TTTSButton} onPress={() => navigation.navigate('TictactoeSingleplayer')}>
              <Text style={styles.gameButtonText}>Tictactoe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.SudokuButton} onPress={newSudokuGame}>
              <Text style={styles.gameButtonText}>Sudoku</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.MinesweeperButton} onPress={startMinesweeper}>
              <Text style={styles.gameButtonText}>Minesweeper</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.gameSection}>
            <Text style={styles.sectionTitle}>Multiplayer games!</Text>
            <TouchableOpacity style={styles.TTTMButton} onPress={() => navigation.navigate('TictactoeMultiplayer')}>
              <Text style={styles.gameButtonText}>Tictactoe</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.Connect4Button} onPress={() => navigation.navigate('Connect4')}>
              <Text style={styles.gameButtonText}>Connect4</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;
