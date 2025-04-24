import { StyleSheet, Dimensions } from 'react-native';

// Haetaan näytön korkeus, jotta overlay voi kattaa koko ruudun
const { height } = Dimensions.get('window');


//  FlappyBird-tyylit yhtenäisessä StyleSheetissä:
//  - Pelinäkymän pohja (container, gameContainer)
//  - Pisteiden esitys (scoreText)
//  - Overlay-käyttöliittymä (overlay, gameOverText, button jne.)
//  - FlappyBirdScreen-napin ja containerin tyylit (HomeButton, buttonContainer)
//  - FlappyResult-näkymän komponenttien tyylit (resultContainer, title, scoreCard, ym.)

const FlappyStyles = StyleSheet.create({
  // Yleistasot pelikomponentille
  container: {
    flex: 1, // Täyttää koko näytön
  },
  gameContainer: {
    flex: 1, //Täyttää koko näytön
  },

  // Piste teksti
  scoreText: {
    position: 'absolute',      // Asetetaan vapaasti päällekkäin
    top: 50,                   // Ylälaitaan 50 px
    left: 20,                  // Vasen marginaali 20 px
    fontSize: 60,              // Suuri fonttikoko
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Silkscreen_400Regular', // Pelityylinen fontti
    textShadowColor: 'black',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },

  // Yleinen overlay tila-näytöille (Game Over, aloita-näyttö)
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    height: height,           // Kattaa koko näytön
    justifyContent: 'center', // Keskittää sisällön pystysuunnassa
    alignItems: 'center',     // Keskittää vaakasuunnassa
    backgroundColor: 'rgba(0,0,0,0.4)', // Läpinäkyvä musta tausta
    zIndex: 20,
    width: '100%',
  },

  // Peli ohi -teksti overlayssä
  gameOverText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Silkscreen_400Regular',
  },

  // Nappien perusmuoto overlayssa
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

  // FlappyBirdScreenin kotinappi
  HomeButton: {
    backgroundColor: 'rgb(136, 255, 0)',
    width: 90,
    height: 35,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 50,             // 50 px alareunasta
    left: 0, right: 0,
    alignItems: 'center',
  },

  // FlappyResult-näkymän container ja otsikko
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

  // Pelaajan tuloskortin tyyli
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

  // Top 10 -listan otsikko
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

  // Vieritettävän listan tyyli
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

  // Top 3 korostukset
  rowGold: {
    backgroundColor: '#ffeb3baa',
  },
  rowSilver: {
    backgroundColor: '#e0e0e0aa',
  },
  rowBronze: {
    backgroundColor: '#ffd180aa',
  },

  // Oma rivi korostetaan keltaisella reunalla
  rowSelf: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },

  // Napit rivissä Alapalkissa
  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
  },
});

export default FlappyStyles;