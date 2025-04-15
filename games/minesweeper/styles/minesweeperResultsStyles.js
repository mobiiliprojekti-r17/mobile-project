import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(153, 255, 204)", 
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 70,
    fontWeight: "bold",
    color:  "rgb(4, 201, 103)", 
    marginBottom: 20,
    marginTop: 60,
    fontFamily: "VT323_400Regular",
  },  
  title2: {
    fontSize: 40,
    fontWeight: "bold",
    color:  "rgb(4, 201, 103)", 
    marginBottom: 10,
    marginTop: 10,
    fontFamily: "VT323_400Regular",
  },
  resultBox: {
    backgroundColor: "rgb(119, 250, 185)", 
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
  },
  infoText: {
    fontSize: 25,
    color: "rgb(0, 105, 53)", 
    marginBottom: 5,
    fontFamily: "VT323_400Regular",
  },
  scrollView: {
    width: "90%",
  },
  scoreItem: {
    backgroundColor: "rgb(119, 250, 185)", 
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scoreText: {
    fontSize: 20,
    color: "rgb(0, 105, 53)", 
    marginBottom: 2,
    fontFamily: "VT323_400Regular",
  },
  noScores: {
    fontSize: 16,
    color: "#555", 
    textAlign: "center",
    marginTop: 10,
    fontFamily: "VT323_400Regular",
  },
  difficultySection: {
    marginBottom: 15,
    backgroundColor: "rgb(76, 252, 164)", 
    padding: 10,
    borderRadius: 8,
  },
  difficultyTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color:"rgb(0, 105, 53)", 
    marginBottom: 5,
    fontFamily: "VT323_400Regular",
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
    color: "rgb(0, 105, 53)", 
    fontWeight: "bold",
    fontFamily: "VT323_400Regular",
    fontSize: 23,
  },
  rank: {
    fontSize: 40,
    fontWeight: "bold",
    color: "rgb(0, 105, 53)",                                        
    marginBottom: 5,
    fontFamily: "VT323_400Regular",
  },
  resultButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 5,
  },
  Button: {
  backgroundColor: "rgb(71, 224, 148)", 
  padding: 10,
  marginHorizontal: 10,
  borderRadius: 5,
  },
  ButtonText: {
    color: "rgb(0, 105, 53)", 
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: "VT323_400Regular",
  }
});

export default styles;
