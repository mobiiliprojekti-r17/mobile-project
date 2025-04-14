import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(160, 220, 255)", 
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color:  "#2162aa",
    marginBottom: 20,
    marginTop: 60,
  },  
  title2: {
    fontSize: 28,
    fontWeight: "bold",
    color:  "#2162aa", 
    marginBottom: 10,
    marginTop: 10,
  },
  resultBox: {
    backgroundColor: "rgb(188, 231, 255)", 
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    color: "#333", 
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2162aa", 
    marginBottom: 10,
  },
  scrollView: {
    width: "90%",
  },
  scoreItem: {
    backgroundColor: "rgb(205, 235, 252)", 
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
    color: "#333", 
    marginBottom: 2,
  },
  noScores: {
    fontSize: 16,
    color: "#555", 
    textAlign: "center",
    marginTop: 10,
  },
  difficultySection: {
    marginBottom: 15,
    backgroundColor: "rgb(188, 231, 255)", 
    padding: 10,
    borderRadius: 8,
  },
  difficultyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2162aa",
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
    color: "#000", 
    fontWeight: "bold",
  },
  rank: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2162aa", 
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
    color: '#fff', 
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export default styles;
