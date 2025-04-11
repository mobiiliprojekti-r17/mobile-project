import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView } from 'react-native';
import { db, collection, addDoc } from '../firebase/Config';
import styles from "../styles/HomeScreenStyles";
import { useNickname } from '../context/context';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import Icon from 'react-native-vector-icons/FontAwesome';

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
      // Navigoidaan Sudoku-näyttöön ja annetaan vaikeustaso
      navigation.navigate('Sudoku', { nickname, difficulty });
    } else if (game === 'Minesweeper') {
      // Navigoidaan Minesweeper-näyttöön ja annetaan vaikeustaso
      navigation.navigate('Minesweeper', { nickname, difficulty });
    } else {
      // Muut pelit käynnistetään oletusvaikeudella
      navigation.navigate(game, { nickname });
    }
  };

  const checkNicknameAndProceed = (game) => {
    if (!nickname.trim()) {
      // Jos nimimerkki puuttuu, näytetään virhe
      showModal('Warning', 'Please enter a nickname first!', 'error');
    } else {
      setSelectedGame(game);  // Asetetaan valittu peli
      // Pelin käynnistäminen heti valinnan yhteydessä
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
    // Käynnistetään peli valitulla vaikeustasolla
    startGame(selectedGame, level);  // Käynnistetään valittu peli ja annetaan vaikeustaso
    setRestartModalVisible(false);
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

          {/* Singleplayer Games Section */}
          <View style={styles.gameSection}>
            <Text style={styles.sectionTitle}>Singleplayer games</Text>
            <View style={styles.gameButtonsContainer}>
              <TouchableOpacity style={styles.g2048Button} onPress={new2048Game}>
                <Text style={styles.gameButtonText}>2048</Text>
                <Icon name="gamepad" size={30} color="white" style={{ marginTop: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.ShooterButton} onPress={startBubbleShooter}>
                <Text style={styles.gameButtonText}>BubbleShooter</Text>
                <Icon name="play" size={30} color="white" style={{ marginTop: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.BreakerButton} onPress={startBrickBreaker}>
                <Text style={styles.gameButtonText}>BrickBreaker</Text>
                <Icon name="arrow-right" size={30} color="white" style={{ marginTop: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.TTTSButton} onPress={() => navigation.navigate('TictactoeSingleplayer')}>
                <Text style={styles.gameButtonText}>Tictactoe</Text>
                <Icon name="puzzle-piece" size={30} color="white" style={{ marginTop: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.SudokuButton} onPress={newSudokuGame}>
                <Text style={styles.gameButtonText}>Sudoku</Text>
                <Icon name="square" size={30} color="white" style={{ marginTop: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.MinesweeperButton} onPress={startMinesweeper}>
                <Text style={styles.gameButtonText}>Minesweeper</Text>
                <Icon name="bomb" size={30} color="white" style={{ marginTop: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.FlappyBirdButton} onPress={startFlappyBird}>
                <Text style={styles.gameButtonText}>FlappyBird</Text>
                <Icon name="twitter" size={30} color="white" style={{ marginTop: 5 }} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Multiplayer Games Section */}
          <View style={styles.gameSection}>
            <Text style={styles.sectionTitle}>Multiplayer games</Text>
            <View style={styles.gameButtonsContainer}>
              <TouchableOpacity style={styles.TTTMButton} onPress={() => navigation.navigate('TictactoeMultiplayer')}>
                <Text style={styles.gameButtonText}>Tictactoe</Text>
                <Icon name="users" size={30} color="white" style={{ marginTop: 5 }} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.Connect4Button} onPress={() => navigation.navigate('Connect4')}>
                <Text style={styles.gameButtonText}>Connect4</Text>
                <Icon name="share-alt" size={30} color="white" style={{ marginTop: 5 }} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Modal for error/success */}
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
