import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, ScrollView, ImageBackground } from 'react-native';
import styles from "../styles/HomeScreenStyles";
import { useNickname } from '../context/context';
import { useFonts, PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { LinearGradient } from 'expo-linear-gradient';

//Sovelluksen aloitusnäkymä
const HomeScreen = ({ navigation }) => {
  const { nickname, setNickname } = useNickname(); // Haetaan ja asetetaan nimimerkki kontekstista
  const [restartModalVisible, setRestartModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState(''); // Modaaliin viesti
  const [modalType, setModalType] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
 //Fontti
  const [fontsLoaded] = useFonts({
    PressStart2P_400Regular,
  });

  if (!fontsLoaded) return null;
  // Funktio nimimerkin lisäämiseen tietokantaan
  const addNickname = async () => {
    if (!nickname.trim()) {
      showModal('Error', 'Nickname cannot be empty!', 'error');
      return;
    }

  };
  // Näyttää modaali-ikkunan
  const showModal = (title, message, type) => {
    setModalMessage(message);
    setModalType(type);
    setRestartModalVisible(true);
  };
  //Navigointi eri peleihin sekä tarvittaessa vaikeustaso
  const startGame = (game, difficulty) => {
    if (game === 'Sudoku') {
      navigation.navigate('Sudoku', { nickname, difficulty });
    } else if (game === 'Minesweeper') {
      navigation.navigate('Minesweeper', { nickname, difficulty });
    } else {
      navigation.navigate(game, { nickname });
    }
  };
  //Katsotaan onko nimimerkki syötetty ennen peliin siirtymistä
  const checkNicknameAndProceed = (game) => {
    if (!nickname.trim()) {
      showModal('Warning', 'Please enter your nickname first!', 'error'); //Jos nimimerkkiä ei ole syötetty, tulee ilmoitus
    } else {
      setSelectedGame(game);
      if (game === 'Sudoku' || game === 'Minesweeper') {
        setRestartModalVisible(true);
        setModalMessage('CHOOSE DIFFICULTY');
        setModalType('difficulty');
      } else {
        startGame(game, 'EASY'); //Aloitetaan peli, johon ei tarvi nimimerkkiä
      }
    }
  };
  //Pelien käynnistysfunktiot
  const newSudokuGame = () => checkNicknameAndProceed('Sudoku');
  const new2048Game = () => checkNicknameAndProceed('2048');
  const startBubbleShooter = () => checkNicknameAndProceed('BubbleShooter');
  const startBrickBreaker = () => checkNicknameAndProceed('BrickBreaker');
  const startMinesweeper = () => checkNicknameAndProceed('Minesweeper');
  const startFlappyBird = () => checkNicknameAndProceed('FlappyBird');
  const startColorSort = () => checkNicknameAndProceed('ColorGame');
  //käsitellään vaikeustason valinta ja käynnistetään peli
  const handleDifficultyChange = (level) => {
    startGame(selectedGame, level);
    setRestartModalVisible(false);
  };

  return (
    <LinearGradient 
    colors={['rgb(252, 130, 239)', 'rgb(157, 226, 255)']}   locations={[0.5, 0.5]}
    style={styles.fullScreen}>
      {/* Vieritettävä näkymä, joka sisältää logon, syötteen ja pelit */}
  <ScrollView contentContainerStyle={styles.container}
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled">
      <ImageBackground
        source={require('../assets/HeaderIcon.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
   {/* Nimimerkin syöttö */}   
  <View style={styles.inputRow}>
    <TextInput
      style={styles.input}
      placeholder="Enter your nickname"
      placeholderTextColor="rgb(127, 0, 255)"
      value={nickname}
      onChangeText={setNickname}
    />
    <TouchableOpacity style={styles.button} onPress={() => setNickname('')}>
      <Text style={styles.buttonText}>Clear</Text>
    </TouchableOpacity>
  </View>
        {/* Yksinpelit */}
        <View style={styles.gameSection}>
          <Text style={styles.sectionTitle}>SINGLEPLAYER GAMES</Text>
          <View style={styles.gameButtonsContainerSingleplayer}>
          {/* Jokainen peli nappina kuvalla */}
          <TouchableOpacity onPress={new2048Game}>
          <ImageBackground source={require('../assets/2048Icon.png')} style={styles.gameButtonSingleplayer} 
           imageStyle={{width: '100%', height: '100%', resizeMode: 'cover'}}>
          </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity onPress={startBubbleShooter}>
          <ImageBackground source={require('../assets/ShooterIcon.jpg')} style={styles.gameButtonSingleplayer} 
          imageStyle={{width: '100%', height: '100%', resizeMode: 'cover'}}>
          </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity onPress={startBrickBreaker}>
          <ImageBackground source={require('../assets/BreakerIcon.jpg')} style={styles.gameButtonSingleplayer} 
          imageStyle={{width: '100%', height: '100%', resizeMode: 'cover'}}>
          </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('TictactoeSingleplayer')}>
          <ImageBackground source={require('../assets/TTTSIcon.jpg')} style={styles.gameButtonSingleplayer} 
          imageStyle={{width: '100%', height: '100%', resizeMode: 'cover'}}>
          </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity onPress={newSudokuGame}>
          <ImageBackground source={require('../assets/SudokuIcon.jpg')} style={styles.gameButtonSingleplayer} 
          imageStyle={{width: '100%', height: '100%', resizeMode: 'cover'}}>
          </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity onPress={startMinesweeper}>
          <ImageBackground source={require('../assets/MinesweeperIcon.jpg')} style={styles.gameButtonSingleplayer}
          imageStyle={{width: '100%', height: '100%', resizeMode: 'cover'}}>
          </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity onPress={startFlappyBird}>
          <ImageBackground source={require('../assets/FlappyBirdIcon.jpg')} style={styles.gameButtonSingleplayer}
          imageStyle={{width: '100%', height: '100%', resizeMode: 'cover'}}>
          </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Connect4Singleplayer')}>
          <ImageBackground source={require('../assets/Connect4SingleIcon.jpg')} style={styles.gameButtonSingleplayer} 
          imageStyle={{width: '100%', height: '100%', resizeMode: 'cover'}}>
          </ImageBackground>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={startColorSort}>
          <ImageBackground source={require('../assets/ColorSortIcon.png')} style={styles.gameButtonSingleplayer} 
          imageStyle={{width: '100%', height: '100%', resizeMode: 'cover'}}>
          </ImageBackground>
          </TouchableOpacity>

          </View>
        </View>
        {/* Moninpelit */}
        <View style={styles.gameSection}>
          <Text style={styles.sectionTitle}>MULTIPLAYER GAMES</Text>
          <View style={styles.gameButtonsContainerMultiplayer}>
          <TouchableOpacity onPress={() => navigation.navigate('TictactoeMultiplayer')}>
          <ImageBackground source={require('../assets/TTTMIcon.jpg')} style={styles.gameButtonMultiplayer} 
          imageStyle={{width: '100%', height: '100%', resizeMode: 'cover'}}>
          </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Connect4Multiplayer')}>
          <ImageBackground source={require('../assets/Connect4MultiIcon.jpg')} style={styles.gameButtonMultiplayer} 
          imageStyle={{width: '100%', height: '100%', resizeMode: 'cover'}}>
          </ImageBackground>
          </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Modaali vaikeustasolle/virheviestille */}
      <Modal
        transparent
        animationType="fade"
        visible={restartModalVisible}
        onRequestClose={() => setRestartModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.difficultyModalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            {/* Vaikeustasovalinta */}
            {modalType === 'difficulty' && (
              <>
                {["EASY", "MEDIUM", "HARD"].map(level => (
                  <TouchableOpacity key={level} onPress={() => handleDifficultyChange(level)} style={styles.difficultyModalButton}>
                    <Text style={styles.difficultyModalButtonText}>{level}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity onPress={() => setRestartModalVisible(false)} style={styles.difficultyModalButton}>
                  <Text style={styles.difficultyModalButtonText}>CANCEL</Text>
                </TouchableOpacity>
              </>
            )}
            {/* OK-nappi virheilmoitukseen */}
            {(modalType === 'error' || modalType === 'success') && (
              <TouchableOpacity onPress={() => setRestartModalVisible(false)} style={styles.ModalButton}>
                <Text style={styles.ModalButtonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

export default HomeScreen;
