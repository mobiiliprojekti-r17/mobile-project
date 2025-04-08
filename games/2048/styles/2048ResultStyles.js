import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const baseWidth = 390; // Käytetään tätä perusleveytenä skaalauksen laskemisessa
const scale = screenWidth / baseWidth;

const scaleSize = (size) => Math.round(size * scale);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#faf8ef",
        alignItems: "center",
        justifyContent: "center",
        padding: scaleSize(50),
      },
    ChangaOneText: {
        fontFamily: 'ChangaOne_400Regular',
        fontSize: scaleSize(70),
        fontWeight: "bold",
        color: "rgb(180, 160, 255)", // Game Over -otsikko
        marginBottom: scaleSize(25), 
      },
  resultBox: {
    backgroundColor: "rgb(180, 160, 255)", // äsk. tuloksille tausta
    padding: scaleSize(7),
    borderRadius: scaleSize(5),
    marginBottom: scaleSize(20),
    width: "70%",
    alignItems: "center",
  },
  infoText: {
    fontSize: scaleSize(18),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: scaleSize(5),
  },
  subtitle: {
    fontSize: scaleSize(22),
    fontWeight: "bold",
    color: "#BB86FC", // Top Scores -otsikko
    marginBottom: scaleSize(10),
  },
  scrollView: {
    width: "90%",
  },

  scoreItem: {
    flexDirection: "row", // Rank vasemmalle ja tekstit keskelle
    alignItems: "center",
    backgroundColor: "rgb(180, 160, 255)",
    paddingVertical: scaleSize(12), 
    paddingHorizontal: scaleSize(15), 
    borderRadius: scaleSize(5),
    marginBottom: scaleSize(10),
  },
  rankContainer: {
    width: scaleSize(60), 
    alignItems: "center",
    justifyContent: "center",
  },
  rank: {
    fontSize: scaleSize(50), 
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  textContainer: {
    flex: 1, // Vie kaiken jäljellä olevan tilan
    flexDirection: "column",
    alignItems: "center", // Keskittää tekstit vaakasuunnassa
  },
  scoreText: {
    fontSize: scaleSize(17),
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: scaleSize(2),
    textAlign: "center", // Varmistaa keskityksen
  },
  noScores: {
    fontSize: scaleSize(16),
    color: "#BBBBBB",
    textAlign: "center",
    marginTop: scaleSize(10),
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: scaleSize(15),
  },
  playAgainButton: {
    backgroundColor: "#03DAC6", 
    padding: scaleSize(12), 
    borderRadius: scaleSize(5),
    flex: 1,
    alignItems: "center",
  },
  homeButton: {
    backgroundColor: "#6200EE",
    padding: scaleSize(12),
    borderRadius: scaleSize(5),
    flex: 1,
    alignItems: "center",
  },
  homeButtonText: {
    color: "white",
    fontSize: scaleSize(16),
    fontWeight: "bold",
  },
});

export default styles;
