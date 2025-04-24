import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { NicknameProvider } from './context/context'; 
import HomeScreen from './screens/HomeScreen';
import BubbleShooterScreen from './games/bubbleShooter/screens/ShooterScreen';
import ShooterGameOver from './games/bubbleShooter/screens/ShooterGameOverScreen';
import BrickBreakerScreen from './games/brickBreaker/screens/BreakerScreen';
import Sudoku from './games/sudoku/screens/SudokuScreen';
import SudokuResult from './games/sudoku/screens/SudokuResultScreen';
import Game2048Screen from './games/2048/screens/2048Screen';
import Game2048ResultScreen from './games/2048/screens/2048ResultScreen';
import TictactoeMultiplayer from './games/tictactoe/screens/TictactoeMulti';
import TictactoeSingleplayer from './games/tictactoe/screens/TictactoeSingle';
import Connect4Multiplayer from './games/Connect4/screens/Connect4MultiScreen';
import Connect4Singleplayer from './games/Connect4/screens/Connect4SingleScreen';
import BreakerResult from './games/brickBreaker/screens/BrickResultScreen';
import MinesweeperScreen from './games/minesweeper/screens/minesweeperscreen';
import MinesweeperResults from './games/minesweeper/screens/minesweeperResults';
import FlappyBirdScreen from './games/FlappyBird/screens/FlappyBirdScreen';
import FlappyResult from './games/FlappyBird/screens/FlappyBirdResult';
import ColorGame from './games/ColorSort/screens/ColorScreen';
import ColorSortResultScreen from './games/ColorSort/screens/ColorSortResultScreen';
import { useFonts, CuteFont_400Regular } from '@expo-google-fonts/cute-font';
import { ChangaOne_400Regular } from '@expo-google-fonts/changa-one';
import { PressStart2P_400Regular } from '@expo-google-fonts/press-start-2p';
import { FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import { Kavoon_400Regular } from '@expo-google-fonts/kavoon';
import { ConcertOne_400Regular } from '@expo-google-fonts/concert-one';
import { Silkscreen_400Regular } from '@expo-google-fonts/silkscreen';
import { Bungee_400Regular } from '@expo-google-fonts/bungee';
import { Audiowide_400Regular } from '@expo-google-fonts/audiowide';



const Stack = createStackNavigator(); // Stack-navigaattori koko sovellukselle

const App = () => {
   // Fonttien lataus, ennen kuin näkymät piirretään
  const [fontsLoaded] = useFonts({
    ChangaOne_400Regular,
    CuteFont_400Regular,
    PressStart2P_400Regular,
    FredokaOne_400Regular,
    VT323_400Regular,
    Kavoon_400Regular,
    ConcertOne_400Regular,
    Silkscreen_400Regular,
    Bungee_400Regular,
    Audiowide_400Regular,
  });
   // Odotetaan fonttien latausta ennen renderöintiä
  if (!fontsLoaded) {
    return null; 
  }

  return (
    //Nicname konteksti koko sovellukselle,stack navigointi ja näkymien määrittely
    <NicknameProvider> 
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false, gestureEnabled: false }}>
          {/* Kaikki eri näkymät ja pelit Stackissa nimettyinä ruutuina */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="BubbleShooter" component={BubbleShooterScreen} />
          <Stack.Screen name="ShooterGameOver" component={ShooterGameOver} />
          <Stack.Screen name="BrickBreaker" component={BrickBreakerScreen} />
          <Stack.Screen name="BreakerResults" component={BreakerResult} />
          <Stack.Screen name="Sudoku" component={Sudoku} />
          <Stack.Screen name="SudokuResult" component={SudokuResult} />
          <Stack.Screen name="Minesweeper" component={MinesweeperScreen} />
          <Stack.Screen name="MinesweeperResults" component={MinesweeperResults} />
          <Stack.Screen name="2048" component={Game2048Screen} />
          <Stack.Screen name="Game2048ResultScreen" component={Game2048ResultScreen} />
          <Stack.Screen name="FlappyBird" component={FlappyBirdScreen} />
          <Stack.Screen name="FlappyBirdResult" component={FlappyResult} /> 
          <Stack.Screen name="TictactoeMultiplayer" component={TictactoeMultiplayer} />
          <Stack.Screen name="TictactoeSingleplayer" component={TictactoeSingleplayer} />
          <Stack.Screen name="Connect4Multiplayer" component={Connect4Multiplayer} />
          <Stack.Screen name="Connect4Singleplayer" component={Connect4Singleplayer} />
          <Stack.Screen name="ColorGame" component={ColorGame} />
          <Stack.Screen name="ColorSortResultScreen" component={ColorSortResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NicknameProvider>
  );
};

export default App;