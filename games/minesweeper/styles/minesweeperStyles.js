import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(153, 255, 204)",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",

    marginTop: 40,
  },
  timer: {
    fontSize: 18,
    marginBottom: 10,
  },
  gameOverText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "red",
    padding: 10,
    borderRadius: 5,
    top: 50,  // Adjust to where you want the text to appear
    zIndex: 10,  // Ensure the game over text is on top
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    backgroundColor: "rgb(63, 210, 136)",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  resultButton: {
    backgroundColor: "rgb(63, 210, 136)",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  resultButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
