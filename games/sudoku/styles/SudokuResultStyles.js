import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(160, 220, 255)", // Taustaväri yhtenäiseksi
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color:  "#2162aa", // Vastaa toisen tiedoston tummaa tekstiä
    marginBottom: 20,
    marginTop: 60,
  },  
  title2: {
    fontSize: 28,
    fontWeight: "bold",
    color:  "#2162aa", // Vastaa toisen tiedoston tummaa tekstiä
    marginBottom: 10,
    marginTop: 10,
  },
  resultBox: {
    backgroundColor: "rgb(188, 231, 255)", // Neutraali tausta tuloksille
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    color: "#333", // Yhtenäinen tumma teksti
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2162aa", // Korvaava väri violettiin nähden
    marginBottom: 10,
  },
  scrollView: {
    width: "90%",
  },
  scoreItem: {
    backgroundColor: "rgb(205, 235, 252)", // Matchaa nappeihin
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreText: {
    fontSize: 16,
    color: "#333", // Selkeä tumma teksti
    marginBottom: 2,
  },
  noScores: {
    fontSize: 16,
    color: "#555", // Hillitty harmaa
    textAlign: "center",
    marginTop: 10,
  },
  difficultySection: {
    marginBottom: 15,
    backgroundColor: "rgb(188, 231, 255)", // Sama kuin napit
    padding: 10,
    borderRadius: 8,
  },
  difficultyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2162aa", // Sama sävy kuin subtitle
    marginBottom: 5,
  },
  picker: {
    width: "80%",
    height: 50,
    backgroundColor: "white",
    color: "#333",
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
    backgroundColor: "rgb(188, 231, 255)",
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: "rgb(127, 203, 244)",
  },
  buttonText: {
    color: "#000", // Musta teksti vaalealla taustalla
    fontWeight: "bold",
  },
  rank: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2162aa", // Yhtenäinen sävy muiden otsikoiden kanssa
    marginBottom: 5,
  },
  Homebutton: {
    backgroundColor: "rgb(188, 231, 255)", 
    width: 100,
    height: 40,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgb(188, 231, 255)" ,
  margin: 5,
  borderRadius: 5,
  marginLeft: 20,
  marginRight: 10,
  marginBottom: 30,
  marginTop: 10,
  },
  
  HomebuttonText: {
    color: '#fff', // White text on buttons for contrast
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export default styles;
