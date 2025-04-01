import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { db, collection, addDoc, getDocs } from '../firebase/Config'; 

const HomeScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState(''); 
  const [nicknames, setNicknames] = useState([]); 

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,  
    });
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

  useEffect(() => {
    fetchNicknames();
  }, []);

  const newSudokuGame = () => {
    if (!nickname.trim()) {
      Alert.alert("Warning", "Please enter a nickname first!");
      return;
    }
    Alert.alert(
      "Choose difficulty",
      "",
      [
        { text: "Easy", onPress: () => startSudokuGame("easy") },
        { text: "Medium", onPress: () => startSudokuGame("medium") },
        { text: "Hard", onPress: () => startSudokuGame("hard") },
        { text: "Cancel", style: "cancel" },
      ],
      { cancelable: false }
    );
  };

  const startSudokuGame = (difficulty) => {
    navigation.navigate("Sudoku", { nickname, difficulty, autoStart: true });
  };
const startBrickBreaker = () => {
  if (!nickname.trim()) {
    Alert.alert("Warning", "Please enter a nickname first!");
    return;
  }
  navigation.navigate("BrickBreaker", { nickname});

}
  const recentNickname = nicknames.length > 0 ? nicknames[nicknames.length - 1].name : '';


  

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

      {recentNickname ? (
        <Text style={styles.nicknameText}>Nickname: {recentNickname}</Text>
      ) : (
        <Text style={styles.nicknameText}>No nickname saved yet.</Text>
      )}
           <Text>Singleplayer games!</Text>
      <TouchableOpacity 
        style={styles.gameButton} 
        onPress={() => navigation.navigate("2048")}>
        <Text style={styles.gameButtonText}>2048</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.gameButton} 
        onPress={() => navigation.navigate('BubbleShooter')}>
        <Text style={styles.gameButtonText}>BubbleShooter</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.gameButton} 
        onPress={startBrickBreaker}>
        <Text style={styles.gameButtonText}>BrickBreaker</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.gameButton} 
        onPress={() => navigation.navigate('TictactoeSingleplayer')}>
        <Text style={styles.gameButtonText}>Tictactoe</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.gameButton} onPress={newSudokuGame}>
        <Text style={styles.gameButtonText}>Sudoku</Text>
      </TouchableOpacity>

     <Text>Multiplayer games!</Text>
     <TouchableOpacity 
        style={styles.gameButton} 
        onPress={() => navigation.navigate('TictactoeMultiplayer')}>
        <Text style={styles.gameButtonText}>Tictactoe</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.gameButton} 
        onPress={() => navigation.navigate('Connect4')}>
        <Text style={styles.gameButtonText}>Connect4</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  gameButton: {
    backgroundColor: 'blue',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  gameButtonText: {
    color: 'white',
    fontSize: 18,
  },
  nicknameText: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    color: 'darkblue',
  },
});

export default HomeScreen;
