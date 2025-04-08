import { StyleSheet } from 'react-native';

const shooterStyles = StyleSheet.create({
  // 🎈 Pallo (ShooterBall) - Ei muutettu!
  ball: {
    position: 'absolute',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
     marginTop:30
  },
  face: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // 🟣 BubbleShooter
  gameContainer: {
    flex: 1,
    backgroundColor:  "rgb(255, 158, 226)", // Sama taustaväri kuin alkuperäisessä
    alignItems: 'center',
    justifyContent: 'center',
    height: "120%",
  },
  scoreText: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 24,
    color: '#6C5DD3', // Pastellinsininen teksti
    textShadowColor: '#8EA7E9', // Vaaleampi sininen varjo
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    marginTop: 40,
  },

  // 🧩 ShooterScreen
  paddedContainer: {
    flex: 1,
    paddingBottom: 40,
    backgroundColor: '#ff8afa', // Sama yhtenäinen taustaväri
  },
  button: {
    backgroundColor: "rgb(253, 122, 214)", 
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
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export default shooterStyles;
