import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Lisää tilaa nappien väliin
    alignItems: 'center', // Varmistaa, että napit ovat samalla linjalla
  },
 
button: {
    backgroundColor: "rgb(58, 226, 255)",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    marginBottom: 20,
},

  //gamebuttons
  g2048Button: {
    backgroundColor: "rgb(211, 181, 255)",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  ShooterButton: {
    backgroundColor: "rgb(255, 158, 226)",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  BreakerButton: {
    backgroundColor: "rgb(192, 253, 111)",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
 TTTSButton: {
    backgroundColor: "rgb(255, 216, 130)",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  SudokuButton: {
    backgroundColor: "rgb(160, 220, 255)",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  MinesweeperButton: {
    backgroundColor: "rgb(153, 255, 204)",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  TTTMButton: {
    backgroundColor: "rgb(251, 151, 137)",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
 Connect4Button: {
    backgroundColor: "rgb(194, 255, 154)",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },

  gameButtonText: {
    color: 'white',
    fontSize: 18,
  },
});
