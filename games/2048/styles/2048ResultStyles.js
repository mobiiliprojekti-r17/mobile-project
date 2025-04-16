import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "rgb(180, 160, 255)",
        paddingHorizontal: width * 0.05,
        paddingTop: height * 0.05,
        paddingBottom: height * 0.02,
      },
    ChangaOneText: {
        fontFamily: 'ChangaOne_400Regular',
        fontSize: width * 0.17,
        textAlign: "center",
        color: "#faf8ef", 
        marginBottom: height * 0.02,
        paddingTop: height * 0.03,
      },
  resultBox: {
    marginBottom: height * 0.02,
    width: width * 0.6,
    alignSelf: "center",
    alignItems: "center",
  },
  infoText: {
    fontSize: width * 0.045,
    textAlign: "center",
    fontWeight: "bold",
    color: "#faf8ef",
    marginBottom: 5,
  },
  subtitle: {
    fontFamily: 'ChangaOne_400Regular',
    fontSize: width * 0.09,
    textAlign: "center",
    fontWeight: "bold",
    color: "#faf8ef", // Top Scores -otsikko
    marginBottom: height * 0.015,
  },
  scrollView: {
    flex: 1,
    marginBottom: 24,
  },

  scoreItem: {
    width: width * 0.8,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgb(180, 160, 255)",
    paddingVertical: height * 0.01,
    paddingHorizontal: width * 0.07,
    marginBottom: height * 0.015,
  },
  rankContainer: {
    width: width * 0.18, 
    alignItems: "center",
    justifyContent: "center",
  },
  rank: {
    fontSize: width * 0.13,
    fontFamily: 'ChangaOne_400Regular',
    color: "#FFFFFF",
  },
  textContainer: {
    flex: 1, // Vie kaiken jäljellä olevan tilan
    justifyContent: "center",
    alignItems: "center", // Keskittää tekstit vaakasuunnassa
  },
  scoreText: {
    fontSize: width * 0.04,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
    textAlign: "center", // Varmistaa keskityksen
  },
  noScores: {
    fontSize: 16,
    color: "#BBBBBB",
    textAlign: "center",
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: height * 0.03,
    marginHorizontal: width * 0.05,
    marginBottom: height * 0.03,
  },
  playAgainButton: {
    backgroundColor: "rgb(255, 158, 226)",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginRight: width * 0.015,
  },
  homeButton: {
    backgroundColor: "rgb(168, 223, 255)",
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.04,
    borderRadius: 5,
    flex: 1,
    alignItems: "center",
    marginLeft: width * 0.015,
  },
  homeButtonText: {
    color: "white",
    fontFamily: 'ChangaOne_400Regular',
    fontSize: width * 0.05,
  },
});

export default styles;
