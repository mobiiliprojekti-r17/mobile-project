import { StyleSheet, Dimensions } from "react-native";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const baseWidth = 400; // Käytetään tätä perusleveytenä skaalauksen laskemisessa
const scale = screenWidth / baseWidth;

const scaleSize = (size) => Math.round(size * scale);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(180, 160, 255)", //"#faf8ef",
        alignItems: "center",
        justifyContent: "center",
        padding: scaleSize(50),
      },
    ChangaOneText: {
        fontFamily: 'ChangaOne_400Regular',
        fontSize: scaleSize(70),
        fontWeight: "bold",
        color: "#faf8ef", // Game Over -otsikko
        marginBottom: scaleSize(20), 
      },
  resultBox: {
    backgroundColor: "rgb(180, 160, 255)", // äsk. tuloksille tausta
    padding: scaleSize(3),
    marginBottom: scaleSize(10),
    width: scaleSize(210),
    alignItems: "center",
  },
  infoText: {
    fontSize: scaleSize(19),
    fontWeight: "bold",
    color: "#faf8ef",
    marginBottom: scaleSize(5),
  },
  subtitle: {
    fontFamily: 'ChangaOne_400Regular',
    fontSize: scaleSize(35),
    fontWeight: "bold",
    color: "#faf8ef", // Top Scores -otsikko
    marginBottom: scaleSize(5),
  },
  scrollView: {
    maxHeight: screenHeight * 0.55,
    width: "90%",
  },

  scoreItem: {
    flexDirection: "row", // Rank vasemmalle ja tekstit keskelle
    alignItems: "center",
    backgroundColor: "rgb(180, 160, 255)",
    paddingVertical: scaleSize(12), 
    paddingHorizontal: scaleSize(15),
    marginBottom: scaleSize(10),
  },
  rankContainer: {
    width: scaleSize(70), 
    alignItems: "center",
    justifyContent: "center",
  },
  rank: {
    fontSize: scaleSize(45), 
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
    marginBottom: scaleSize(1),
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
  },
  playAgainButton: {
    backgroundColor: "rgb(255, 158, 226)", 
    padding: scaleSize(12), 
    borderRadius: scaleSize(5),
    flex: 1,
    alignItems: "center",
    marginRight: scaleSize(7.5),
  },
  homeButton: {
    backgroundColor: "rgb(168, 223, 255)",
    padding: scaleSize(12),
    borderRadius: scaleSize(5),
    flex: 1,
    alignItems: "center",
    marginLeft: scaleSize(7.5),
  },
  homeButtonText: {
    color: "white",
    fontSize: scaleSize(16),
    fontWeight: "bold",
  },
});

export default styles;
