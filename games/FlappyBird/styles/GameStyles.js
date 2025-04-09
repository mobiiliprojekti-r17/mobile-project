import { StyleSheet, Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#70c5ce',
  },
  score: {
    position: 'absolute',
    top: 60,
    alignSelf: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  gameOver: {
    position: 'absolute',
    top: screenHeight / 2 - 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  restart: {
    fontSize: 20,
    color: 'white',
    marginTop: 20,
  },
  Homebutton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#2196F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Uudet tyylit aloitusnäytölle:
  startGameContainer: {
    position: 'absolute',
    top: screenHeight / 2 - 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  startGameText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
});
