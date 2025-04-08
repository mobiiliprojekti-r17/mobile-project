import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ScrollView } from 'react-native';
import { db, collection, addDoc } from '../firebase/Config';
import styles from "../styles/HomeScreenStyles";
import { useNickname } from '../context/context';

const HomeScreen = ({ navigation }) => {
  const { nickname, setNickname } = useNickname();
  const [nicknames, setNicknames] = useState([]);

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

  const newSudokuGame = () => {
    if (!nickname.trim()) {
      Alert.alert("Warning", "Please enter a nickname first!");
      return;
    }

    Alert.alert(
      "Choose difficulty",
      "",
      [
        { text: "Easy", onPress: () => startGame("Sudoku", "easy") },
        { text: "Medium", onPress: () => startGame("Sudoku", "medium") },
        { text: "Hard", onPress: () => startGame("Sudoku", "hard") },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: false }
    );
  };

  const startGame = (game, difficulty) => {
    navigation.navigate(game, { nickname, difficulty, autoStart: true });
  };

  const new2048Game = () => {
    if (!nickname.trim()) {
      Alert.alert("Warning", "Please enter a nickname first!");
      return;
    }
    navigation.navigate("2048", { nickname });
  };

  const startBubbleShooter = () => {
    if (!nickname.trim()) {
      Alert.alert("Warning", "Please enter a nickname first!");
      return;
    }
    navigation.navigate("BubbleShooter");
  };

  const startBrickBreaker = () => {
    if (!nickname.trim()) {
      Alert.alert("Warning", "Please enter a nickname first!");
      return;
    }
    navigation.navigate("BrickBreaker");
  };

  const startMinesweeper = () => {
    if (!nickname.trim()) {
      Alert.alert("Warning", "Please enter a nickname first!");
      return;
    }

    Alert.alert(
      "Choose difficulty",
      "",
      [
        { text: "Easy", onPress: () => startGame("Minesweeper", "easy") },
        { text: "Medium", onPress: () => startGame("Minesweeper", "medium") },
        { text: "Hard", onPress: () => startGame("Minesweeper", "hard") },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: false }
    );
  };

  return (
    <ScrollView 
    style={styles.scrollView} 
    contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to the Game!</Text>
  
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
  
        <Text>Singleplayer games!</Text>
        <TouchableOpacity style={styles.gameButton} onPress={new2048Game}>
          <Text style={styles.g2048Text}>2048</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gameButton} onPress={startBubbleShooter}>
          <Text style={styles.shooterText}>BubbleShooter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gameButton} onPress={startBrickBreaker}>
          <Text style={styles.breakerText}>BrickBreaker</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gameButton} onPress={() => navigation.navigate('TictactoeSingleplayer')}>
          <Text style={styles.tttsText}>Tictactoe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gameButton} onPress={newSudokuGame}>
          <Text style={styles.sudokuText}>Sudoku</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gameButton} onPress={startMinesweeper}>
          <Text style={styles.minesweeperText}>Minesweeper</Text>
        </TouchableOpacity>
  
        <Text>Multiplayer games!</Text>
        <TouchableOpacity style={styles.gameButton} onPress={() => navigation.navigate('TictactoeMultiplayer')}>
          <Text style={styles.tttmText}>Tictactoe</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.gameButton} onPress={() => navigation.navigate('Connect4')}>
          <Text style={styles.connect4Text}>Connect4</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
