import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

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
import Connect4 from './games/Connect4/screens/Connect4Screen';
import BreakerResult from './games/brickBreaker/screens/BrickResultScreen';

// ⬇️ Tämä on tärkeä!
import { NicknameProvider } from './context/context'; // varmista että tiedoston nimi on oikein

const Stack = createStackNavigator();

const App = () => {
  return (
    <NicknameProvider> {/* ⬅️ Tämä käärii NavigationContainerin */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="BubbleShooter" component={BubbleShooterScreen} />
          <Stack.Screen name="ShooterGameOver" component={ShooterGameOver} />
          <Stack.Screen name="BrickBreaker" component={BrickBreakerScreen} />
          <Stack.Screen name="BreakerResults" component={BreakerResult} />
          <Stack.Screen name="Sudoku" component={Sudoku} />
          <Stack.Screen name="SudokuResult" component={SudokuResult} />
          <Stack.Screen name="2048" component={Game2048Screen} />
          <Stack.Screen name="Game2048ResultScreen" component={Game2048ResultScreen} />
          <Stack.Screen name="TictactoeMultiplayer" component={TictactoeMultiplayer} />
          <Stack.Screen name="TictactoeSingleplayer" component={TictactoeSingleplayer} />
          <Stack.Screen name="Connect4" component={Connect4} />
        </Stack.Navigator>
      </NavigationContainer>
    </NicknameProvider>
  );
};

export default App;
