import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, TextInput, Alert, StyleSheet } from 'react-native';
import { firestore } from '../firebase/Config'

const HomeScreen = ({ navigation }) => {
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState(null); // Käyttäjän tunniste

  // Ladataan käyttäjän nickname Firestoresta (jos tallennettu)
  useEffect(() => {
    const fetchNickname = async () => {
      try {
        const userDoc = await firestore().collection('users').doc('user1').get(); // Käytä esim. autentikoitua UID:ta
        if (userDoc.exists) {
          setNickname(userDoc.data().nickname);
        }
      } catch (error) {
        console.error("Error fetching nickname:", error);
      }
    };
    fetchNickname();
  }, []);

  // Tallennetaan nickname Firestoreen
  const saveNickname = async (name) => {
    setNickname(name);
    try {
      await firestore().collection('users').doc('user1').set({ nickname: name });
      console.log("Nickname saved to Firestore!");
    } catch (error) {
      console.error("Error saving nickname:", error);
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
        { text: "Easy", onPress: () => startSudokuGame("easy") },
        { text: "Medium", onPress: () => startSudokuGame("medium") },
        { text: "Hard", onPress: () => startSudokuGame("hard") },
      ],
      { cancelable: false }
    );
    
  };
  const startSudokuGame = (difficulty) => {
    navigation.navigate("Sudoku", { difficulty, autoStart: true });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Game!</Text>


      {/* Nickname syöttökenttä */}
      <TextInput
        style={styles.input}
        placeholder="Enter your nickname"
        value={nickname}
        onChangeText={saveNickname}
        />
      
      {/* 2048 linkki */}
      <TouchableOpacity 
        style={styles.gameButton} 
        onPress={() => navigation.navigate("2048")}
      >
        <Text style={styles.gameButtonText}>2048</Text>
      </TouchableOpacity>

      {/* Muut pelilinkit */}
      <Button
        title="Bubble Shooter"
        onPress={() => navigation.navigate('BubbleShooter')}
      />
      <Button
        title="Brick Breaker"
        onPress={() => navigation.navigate('BrickBreaker')}
      />
      <TouchableOpacity style={styles.gameButton} onPress={newSudokuGame}>
        <Text style={styles.gameButtonText}>Start Sudoku</Text>
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
});

export default HomeScreen;
