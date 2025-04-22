// Tuodaan React Native -tyylitiedostotyökalu
import { StyleSheet } from 'react-native';


  //BreakerStyles: tyylit sovelluksen eri näkymille:

const BreakerStyles = StyleSheet.create({
  // Pääcontainer, jakaa tilan pelialueen ja muiden elementtien kesken
  container: {
    flex: 1,                         // Täyttää koko tilan
    justifyContent: 'space-between',// Jakaa ala- ja yläreunan välillä
    backgroundColor: 'rgb(192, 253, 111)', // Vaalea vihreä taustaväri
  },
  // Pelialueen container
  gameContainer: {
    flex: 1,                         // Kasvaa täyteen tilaan
    width: '100%',                   // Täyttää leveyssuunnassa
  },
  // Napin container alaosassa
  buttonContainer: {
    alignItems: 'center',            // Keskittää vaakasuunnassa
  },

  // Nappityyli (ei sisällä homeButtonia)
  button: {
    width: 170,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 1,
  },
  // Nappitekstin tyyli
  buttonText: {
    color: 'white',
    fontFamily: 'PressStart2P-Regular', // Pikselifontti
    fontSize: 17,
    textAlign: 'center',
  },
  // Pisteiden näyttö pelissä
  score: {
    color: 'black',
    fontFamily: 'PressStart2P-Regular',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 65,                   // Erottaa pelialueen ylälaidalla olevista pisteistä
  },

  // Overlay-tila (Game Over ja/tai Start-viesti)
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Läpinäkyvä musta
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    height: '120%',                 // Ylittää tarvittaessa
    width: '100%',
  },
  // Overlay-tekstin tyyli
  overlayText: {
    color: 'white',
    fontFamily: 'PressStart2P-Regular',
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },

  // Kotinappi overlay- ja pelin jälkeen
  homeButton: {
    backgroundColor: 'rgb(160, 231, 68)',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 5,
    marginBottom: 30,
  },
  homeButtonText: {
    color: 'black',
    fontFamily: 'PressStart2P-Regular',
    fontSize: 17,
  },

  gameOverText: {},
});

export default BreakerStyles;