import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#BB86FC",
    marginBottom: 20,
  },
  resultBox: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#BB86FC",
    marginBottom: 10,
  },
  scrollView: {
    width: "90%",
  },
  scoreItem: {
    backgroundColor: "#1E1E1E",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 16,
    color: "#FFFFFF",
  },
  noScores: {
    fontSize: 16,
    color: "#BBBBBB",
    textAlign: "center",
    marginTop: 10,
  },
  difficultySection: {
    marginBottom: 15,
    backgroundColor: "#252525",
    padding: 10,
    borderRadius: 8,
  },
  difficultyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#BB86FC",
    marginBottom: 5,
  },
  picker: {
    width: "80%",
    height: 50,
    backgroundColor: "#333",
    color: "#fff",
    marginBottom: 15,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  
  filterButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "#333",
    borderRadius: 5,
  },
  
  selectedButton: {
    backgroundColor: "#6200EE",
  },
  
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
rank: {
  fontSize: 20,
  fontWeight: "bold",
  color: "#6200EE",
  marginBottom: 5, // 🔹 Väli numeron ja Nicknamen väliin
},
scoreItem: {
  backgroundColor: "#F3F3F3", // 🔹 Pehmeä tausta erottuvuuden parantamiseksi
  padding: 10,
  marginVertical: 5,
  borderRadius: 8,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},
scoreText: {
  fontSize: 16,
  color: "#333",
  marginBottom: 2, // 🔹 Pieni väli riveille
},

  
  
});

export default styles;