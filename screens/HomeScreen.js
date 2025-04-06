
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { db, collection, addDoc, getDocs } from '../firebase/Config'; 
import styles from "../styles/styles"
import { useNickname } from '../context/context';

const HomeScreen = ({ navigation }) => {
  const { nickname, setNickname } = useNickname(); // 👈 korvaa useState
  const [nicknames, setNicknames] = useState([]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
    fetchNicknames();
  }, [navigation]);

  const fetchNicknames = async () => {
    const querySnapshot = await getDocs(collection(db, "NicknameList"));
    let nicknameList = [];
    querySnapshot.forEach((doc) => {
      nicknameList.push({ id: doc.id, ...doc.data() });
    });
    setNicknames(nicknameList);
  };

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
    
    // Alert for difficulty selection
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
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Game!</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your nickname"
        value={nickname}
        onChangeText={setNickname}
      />
      <TouchableOpacity style={styles.button} onPress={addNickname}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => setNickname('')}>
        <Text style={styles.buttonText}>Clear</Text>
      </TouchableOpacity>


      <Text>Singleplayer games!</Text>
      <TouchableOpacity style={styles.gameButton} onPress={new2048Game}>
        <Text style={styles.gameButtonText}>2048</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.gameButton} onPress={startBubbleShooter}>
        <Text style={styles.gameButtonText}>BubbleShooter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.gameButton} onPress={startBrickBreaker}>
        <Text style={styles.gameButtonText}>BrickBreaker</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.gameButton} onPress={() => navigation.navigate('TictactoeSingleplayer')}>
        <Text style={styles.gameButtonText}>Tictactoe</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.gameButton} onPress={newSudokuGame}>
        <Text style={styles.gameButtonText}>Sudoku</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.gameButton} onPress={startMinesweeper}>
        <Text style={styles.gameButtonText}>Minesweeper</Text>
      </TouchableOpacity>
      <Text>Multiplayer games!</Text>
      <TouchableOpacity style={styles.gameButton} onPress={() => navigation.navigate('TictactoeMultiplayer')}>
        <Text style={styles.gameButtonText}>Tictactoe</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.gameButton} onPress={() => navigation.navigate('Connect4')}>
        <Text style={styles.gameButtonText}>Connect4</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
