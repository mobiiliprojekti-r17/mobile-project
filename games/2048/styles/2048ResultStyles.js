import { StyleSheet, Dimensions } from "react-native";

// Haetaan näytön mitat
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  // Pääsäiliön tyylit: taustaväri ja reunoille suhteelliset marginaalit
  container: {
    flex: 1,
    backgroundColor: "rgb(211, 181, 255)",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
    paddingBottom: height * 0.02,
  },
  // Otsikon tyyli
  ChangaOneText: {
    fontFamily: 'ChangaOne_400Regular',
    fontSize: width * 0.16,
    textAlign: "center",
    color: "#faf8ef", 
    marginBottom: height * 0.02,
    paddingTop: height * 0.03,
  },
  // Äskeisen tuloksen laatikko
  resultBox: {
    marginBottom: height * 0.02,
    width: width * 0.6,
    alignSelf: "center",
    alignItems: "center",
  },
  // Äskeisen tuloksen tyyli
  infoText: {
    fontSize: width * 0.045,
    textAlign: "center",
    fontWeight: "bold",
    color: "#faf8ef",
    marginBottom: 5,
  },
  // Top 10 otsikko
  subtitle: {
    fontFamily: 'ChangaOne_400Regular',
    fontSize: width * 0.09,
    textAlign: "center",
    fontWeight: "bold",
    color: "#faf8ef",
    marginBottom: height * 0.015,
  },
  // Scrollview: mahdollistaa sisällön scrollauksen
  scrollView: {
    flex: 1,
    marginBottom: 24,
  },
  // Top 10 listan rivien tyyli
  scoreItem: {
    width: width * 0.8,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(211, 181, 255)",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.08,
    marginBottom: height * 0.015,
  },
  // Sijoitusnumeron laatikko
  rankContainer: {
    width: width * 0.27, 
    alignItems: "center",
    justifyContent: "center",
  },
  // Sijoitusnumero
  rank: {
    fontSize: width * 0.13,
    fontFamily: 'ChangaOne_400Regular',
    color: "#FFFFFF",
  },
  // Top 10 tulosten asettelu
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // Top 10 tulokset
  scoreText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 1,
    textAlign: "center", // Varmistaa keskityksen
  },
  // Näytetään, jos tuloksia ei ole
  noScores: {
    fontSize: 16,
    color: "#BBBBBB",
    textAlign: "center",
    marginTop: 10,
  },
  // Koti- ja play again nappien asettelu
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.02,
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.03,
  },
  // Play again napin säätö
  playAgainButton: {
    backgroundColor: "rgb(255, 158, 226)",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: width * 0.015,
  },
  // Kotinapin säätö
  homeButton: {
    backgroundColor: "rgb(168, 223, 255)",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginLeft: width * 0.015,
  },
  // Koti- ja play again nappien tekstin tyyli
  homeButtonText: {
    color: "white",
    fontFamily: 'ChangaOne_400Regular',
    fontSize: width * 0.05,
  },
});

export default styles;
