import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#faf8ef",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      },
  title: {
    fontSize: 35,
    fontWeight: "bold",
    color: "#BB86FC", // Game Over -otsikko
    marginBottom: 20,
  },
  resultBox: {
    backgroundColor: "rgb(180, 160, 255)", // äsk. tuloksille tausta
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
  },
  infoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#BB86FC", // Top Scores -otsikko
    marginBottom: 10,
  },
  scrollView: {
    width: "80%",
  },

  scoreItem: {
    flexDirection: "row", // Rank vasemmalle ja tekstit keskelle
    alignItems: "center",
    backgroundColor: "rgb(180, 160, 255)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  rankContainer: {
    width: 50, // Kiinteä leveys, jotta rankit pysyvät linjassa
    alignItems: "center",
    justifyContent: "center",
  },
  rank: {
    fontSize: 40, // Isompi fontti rankille
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  textContainer: {
    flex: 1, // Vie kaiken jäljellä olevan tilan
    flexDirection: "column",
    alignItems: "center", // Keskittää tekstit vaakasuunnassa
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 2,
    textAlign: "center", // Varmistaa keskityksen
  },
  noScores: {
    fontSize: 16,
    color: "#BBBBBB",
    textAlign: "center",
    marginTop: 10,
  },
  homeButton: {
    backgroundColor: "#6200EE",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  homeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default styles;
