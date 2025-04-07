import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "lightblue",
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontFamily: 'PressStart2P_400Regular',
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
    color: "#222",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  input: {
    width: "90%",
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "white",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "rgb(58, 226, 255)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    elevation: 3,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  gameSection: {
    width: "95%",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
    textDecorationLine: "underline",
  },

  gameButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },

  // Game buttons, keep original colors
  g2048Button: {
    backgroundColor: "rgb(211, 181, 255)",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  ShooterButton: {
    backgroundColor: "rgb(255, 158, 226)",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  BreakerButton: {
    backgroundColor: "rgb(255, 199, 144)",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  TTTSButton: {
    backgroundColor: "rgb(255, 216, 130)",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  SudokuButton: {
    backgroundColor: "rgb(160, 220, 255)",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  MinesweeperButton: {
    backgroundColor: "rgb(153, 255, 204)",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  TTTMButton: {
    backgroundColor: "rgb(251, 151, 137)",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
  Connect4Button: {
    backgroundColor: "rgb(194, 255, 154)",
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
  },
});
