import { StyleSheet } from 'react-native';

const FlappyStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: "#71C5CF",
  },
  gameContainer: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: "rgb(159, 228, 70)", 
    width: 100,
    height: 45,
    borderRadius: 8,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Silkscreen_400Regular',
  },

  overlayText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Silkscreen_400Regular',
  },
});

export default FlappyStyles;
