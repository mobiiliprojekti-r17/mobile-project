// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './games/bubbleShooter/screens/ShooterScreen';  // Pelikomponentti
import BrickBreakerScreen from './games/brickBreaker/screens/BreakerScreen';
import Sudoku from './games/sudoku/screens/SudokuScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="GameScreen" component={GameScreen} />
        <Stack.Screen name="BrickBreaker" component={BrickBreakerScreen} />
        <Stack.Screen name="Sudoku" component={Sudoku} />
        </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
