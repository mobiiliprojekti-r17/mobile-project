import { StyleSheet, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');


const FlappyStyles = StyleSheet.create({
  // Styles for FlappyBird.js
  container: {
    flex: 1,
  },
  gameContainer: {
    flex: 1,
  },
  scoreText: {
    position: 'absolute',
    top: 50,
    left: 20,
    fontSize: 60,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Silkscreen_400Regular',
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    zIndex: 20,
    width: '100%',
  },
  gameOverText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Silkscreen_400Regular',
  },
  button: {
    backgroundColor: 'rgb(159,228,70)',
    width: 150,
    height: 45,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Silkscreen_400Regular',
  },
  // Styles for FlappyBirdResult.js
  resultContainer: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 40,
    fontWeight: '900',
    color: '#fff',
    alignSelf: 'center',
    marginVertical: 12,
    textShadowColor: '#0008',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    fontFamily: 'Silkscreen_400Regular',
  },
  scoreCard: {
    backgroundColor: '#ffffffaa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignSelf: 'stretch',
  },
  playerLine: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginVertical: 2,
    fontFamily: 'Silkscreen_400Regular',
  },
  label: {
    fontWeight: '800',
    color: '#000',
    fontFamily: 'Silkscreen_400Regular',
  },
  leaderTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    alignSelf: 'center',
    textShadowColor: '#0008',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    fontFamily: 'Silkscreen_400Regular',
  },
  scroll: {
    flex: 1,
    alignSelf: 'stretch',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ffffffcc',
    borderRadius: 8,
    marginVertical: 3,
  },
  rowText: {
    fontSize: 25,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Silkscreen_400Regular',
  },
  noScores: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 25,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Silkscreen_400Regular',
  },
  rowGold: {
    backgroundColor: '#ffeb3baa',
  },
  rowSilver: {
    backgroundColor: '#e0e0e0aa',
  },
  rowBronze: {
    backgroundColor: '#ffd180aa',
  },
  rowSelf: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
  },
});
export default FlappyStyles;