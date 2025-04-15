import { StyleSheet } from 'react-native';

const BreakerStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: "rgb(192, 253, 111)",
  },
  gameContainer: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: 170,
    height: 50,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
  },
  buttonText: {
    color: 'white',
    fontFamily: "PressStart2P-Regular",
    fontSize: 18,
    textAlign: 'center',
  },
  score: {
    color: "black",
    fontFamily: "PressStart2P-Regular",
    fontSize: 18,
    textAlign: "center",
    marginTop: 65,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    height: "120%",
    width: '100%',
  },
  overlayText: {
    color: 'white',
    fontFamily: "PressStart2P-Regular",
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  homeButton: {
    backgroundColor: "rgb(160, 231, 68)",
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 5,
    marginBottom: 30,
  },
  homeButtonText: {
    color: "#black",
    fontFamily: "PressStart2P-Regular",
    fontSize: 18,
  },
  
});

export default BreakerStyles;
