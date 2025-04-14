import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, ImageBackground } from 'react-native';
import { db, collection, addDoc } from '../firebase/Config';
import styles from "../styles/HomeScreenStyles";
import { useNickname } from '../context/context';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';

const HomeScreen = ({ navigation }) => {
  const { nickname, setNickname } = useNickname();
  const [nicknames, setNicknames] = useState([]);

  // Modaalit
  const [restartModalVisible, setRestartModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');
  const [selectedGame, setSelectedGame] = useState('');

  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  if (!fontsLoaded) return null;

  const addNickname = async () => {
    if (!nickname.trim()) {
      showModal('Error', 'Nickname cannot be empty!', 'error');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "NicknameList"), { Nickname: nickname });
      setNicknames((prevNicknames) => [...prevNicknames, { id: docRef.id, Nickname: nickname }]);
      showModal('Success', 'Nickname saved!', 'success');
    } catch (error) {
      showModal('Error', 'Failed to save nickname: ' + error.message, 'error');
      console.error("Firestore error:", error);
    }
  };

  const showModal = (title, message, type) => {
    setModalMessage(message);
    setModalType(type);
    setRestartModalVisible(true);
  };

  const startGame = (game, difficulty) => {
    if (game === 'Sudoku') {
      navigation.navigate('Sudoku', { nickname, difficulty });
    } else if (game === 'Minesweeper') {
      navigation.navigate('Minesweeper', { nickname, difficulty });
    } else {
      navigation.navigate(game, { nickname });
    }
  };

  const checkNicknameAndProceed = (game) => {
    if (!nickname.trim()) {
      showModal('Warning', 'Please enter a nickname first!', 'error');
    } else {
      setSelectedGame(game);  
      if (game === 'Sudoku' || game === 'Minesweeper') {
        setRestartModalVisible(true);
        setModalMessage('Choose difficulty');
        setModalType('difficulty');
      } else {
        startGame(game, 'easy');
      }
    }
  };

  const newSudokuGame = () => {
    checkNicknameAndProceed('Sudoku');
  };

  const new2048Game = () => checkNicknameAndProceed('2048');
  const startBubbleShooter = () => checkNicknameAndProceed('BubbleShooter');
  const startBrickBreaker = () => checkNicknameAndProceed('BrickBreaker');
  const startMinesweeper = () => {
    checkNicknameAndProceed('Minesweeper');
  };
  const startFlappyBird = () => checkNicknameAndProceed('FlappyBird');

  const handleDifficultyChange = (level) => {
    startGame(selectedGame, level); 
    setRestartModalVisible(false);
  };

  return (
    <View style={styles.fullScreen}>
      <View style={styles.scrollContainer}>
        <ScrollView contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
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
            <Text style={styles.sectionTitle}>Singleplayer games</Text>
            <View style={styles.gameButtonsContainer}>
              <TouchableOpacity style={styles.game2048Button} onPress={new2048Game}>
                <ImageBackground source={require('../assets/2048Icon.jpg')} style={styles.backgroundImage}
                    imageStyle={{ borderRadius: 10 }}>
                   <Text style={styles.game2048ButtonText}>2048</Text></ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity style={styles.ShooterButton} onPress={startBubbleShooter}>
                <ImageBackground source={require('../assets/ShooterIcon.jpg')} style={styles.backgroundImage}
                    imageStyle={{ borderRadius: 10 }}>
                <Text style={styles.ShooterButtonText}></Text></ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity style={styles.BreakerButton} onPress={startBrickBreaker}>
                <ImageBackground source={require('../assets/BreakerIcon.jpg')} style={styles.backgroundImage}
                    imageStyle={{ borderRadius: 10 }}>
                <Text style={styles.BreakerButtonText}></Text></ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity style={styles.TTTSButton} onPress={() => navigation.navigate('TictactoeSingleplayer')}>
                <ImageBackground source={require('../assets/TTTSIcon.jpg')} style={styles.backgroundImage}
                imageStyle={{ borderRadius: 10}}>
                  <Text style={styles.TTTSButtonText}></Text></ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity style={styles.SudokuButton} onPress={newSudokuGame}>
                <ImageBackground source={require('../assets/SudokuIcon.jpg')} style={styles.backgroundImage}
                    imageStyle={{ borderRadius: 10 }}><Text style={styles.SudokuButtonText}></Text></ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity style={styles.MinesweeperButton} onPress={startMinesweeper}>
              <ImageBackground source={require('../assets/MinesweeperIcon.jpg')} style={styles.backgroundImage}
                imageStyle={{ borderRadius: 10 }}><Text style={styles.MinesweeperButtonText}></Text></ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity style={styles.FlappyBirdButton} onPress={startFlappyBird}>
              <ImageBackground source={require('../assets/FlappyBirdIcon.jpg')} style={styles.backgroundImage}
                imageStyle={{ borderRadius: 10 }}><Text style={styles.FlappyBirdButtonText}></Text></ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity style={styles.Connect4SingleButton} onPress={() => navigation.navigate('Connect4Singleplayer')}>
              <ImageBackground source={require('../assets/Connect4SingleIcon.jpg')} style={styles.backgroundImage}
                imageStyle={{ borderRadius: 10 }}><Text style={styles.Connect4SingleButtonText}></Text></ImageBackground>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.gameSection}>
            <Text style={styles.sectionTitle}>Multiplayer games</Text>
            <View style={styles.gameButtonsContainer}>
              <TouchableOpacity style={styles.TTTMButton} onPress={() => navigation.navigate('TictactoeMultiplayer')}>
              <ImageBackground source={require('../assets/TTTMIcon.jpg')} style={styles.backgroundImage}
                imageStyle={{ borderRadius: 10}}>
                  <Text style={styles.TTTMButtonText}></Text></ImageBackground>
              </TouchableOpacity>
              <TouchableOpacity style={styles.Connect4MultiButton} onPress={() => navigation.navigate('Connect4Multiplayer')}>
              <ImageBackground source={require('../assets/Connect4MultiIcon.jpg')} style={styles.backgroundImage}
                imageStyle={{ borderRadius: 10 }}><Text style={styles.Connect4MultiButtonText}></Text></ImageBackground>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      <Modal
        transparent
        animationType="fade"
        visible={restartModalVisible}
        onRequestClose={() => setRestartModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.difficultyModalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>

            {modalType === 'difficulty' && (
              <>
                {["easy", "medium", "hard"].map(level => (
                  <TouchableOpacity key={level} onPress={() => handleDifficultyChange(level)} style={styles.difficultyModalButton}>
                    <Text style={styles.difficultyModalButtonText}>{level}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setRestartModalVisible(false)} style={styles.difficultyModalButton}>
                  <Text style={styles.difficultyModalButtonText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}

            {modalType === 'error' && (
              <TouchableOpacity onPress={() => setRestartModalVisible(false)} style={styles.ModalButton}>
                <Text style={styles.ModalButtonText}>OK</Text>
              </TouchableOpacity>
            )}

            {modalType === 'success' && (
              <TouchableOpacity onPress={() => setRestartModalVisible(false)} style={styles.ModalButton}>
                <Text style={styles.ModalButtonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;