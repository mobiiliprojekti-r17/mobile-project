import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgb(194, 255, 154)", // Pehmeä vaalea vihreä tausta
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: '#3b2a3a',  // Darker text for contrast, a richer shade to match background
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
player: {
  fontSize:20,
marginBottom: 10,
},
  winnerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b2a3a', // Tumma väri voittajan tekstille, jotta se on luettavissa
    marginTop: 10,
  },
  board: {
    backgroundColor: "rgb(106, 255, 7)", // Vaalea vihreä lauta, joka täydentää taustaväriä
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: 40,
    height: 40,
    backgroundColor: "rgb(194, 255, 154)",
    borderRadius: 25,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disc: {
    width: 40,
    height: 40,
    borderRadius: 22.5,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "rgb(49, 118, 4)", // Vihreä nappi, joka sulautuu teemaan
    borderRadius: 5,
  },
  buttonText: {
    color: 'white', // Valkoinen teksti vihreällä napilla, jotta se erottuu
    fontSize: 18,
  },
});
