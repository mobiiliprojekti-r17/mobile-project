import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(153, 255, 204)", // Taustaväri yhtenäiseksi
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color:  "rgb(4, 201, 103)", // Vastaa toisen tiedoston tummaa tekstiä
    marginBottom: 20,
    marginTop: 60,
  },  
  title2: {
    fontSize: 28,
    fontWeight: "bold",
    color:  "rgb(4, 201, 103)", // Vastaa toisen tiedoston tummaa tekstiä
    marginBottom: 10,
    marginTop: 10,
  },
  resultBox: {
    backgroundColor: "rgb(119, 250, 185)", // Neutraali tausta tuloksille
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    color: "rgb(0, 0, 0)", // Yhtenäinen tumma teksti
    marginBottom: 5,
  },
  scrollView: {
    width: "90%",
  },
  scoreItem: {
    backgroundColor: "rgb(119, 250, 185)", // Matchaa nappeihin
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
    color: "rgb(0, 0, 0)", // Selkeä tumma teksti
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
    backgroundColor: "rgb(76, 252, 164)", // Sama kuin napit
    padding: 10,
    borderRadius: 8,
  },
  difficultyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color:"rgb(4, 201, 103)", // Sama sävy kuin subtitle
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
    backgroundColor: "rgb(76, 252, 164)",
    borderRadius: 5,
  },
  selectedButton: {
    backgroundColor: "rgb(71, 224, 148)",
  },
  buttonText: {
    color: "#000", // Musta teksti vaalealla taustalla
    fontWeight: "bold",
  },
  rank: {
    fontSize: 20,
    fontWeight: "bold",
    color: "rgb(4, 201, 103)", // Yhtenäinen sävy muiden otsikoiden kanssa                                      §   
marginBottom: 5,
  },
  Homebutton: {
  backgroundColor: "rgb(71, 224, 148)", 
  width: 100,
  height: 40,
  justifyContent: "center",
  alignItems: "center",
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
