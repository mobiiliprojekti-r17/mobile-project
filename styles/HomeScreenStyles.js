import { StyleSheet } from "react-native";

export default StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: 'lightblue',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  
  
  container: {
    width: '100%',
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    backgroundColor: "rgb(58, 226, 255)",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },

  gameButton: {
    padding: 10,
    marginVertical: 2, 
    borderRadius: 5,
  },

  g2048Text: {
    backgroundColor: "rgb(211, 181, 255)",
    color: 'rgb(255, 199, 144)',
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'ChangaOne_400Regular',
  },
  shooterText: {
    backgroundColor: "rgb(255, 158, 226)",
    color: 'rgb(153, 255, 204)',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'CuteFont_400Regular',
  },
  breakerText: {
    backgroundColor: "rgb(255, 199, 144)",
    color: 'white',
    fontSize: 19,
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
    fontFamily: 'FredokaOne_400Regular',
  },
  tttsText: {
    backgroundColor: "rgb(255, 216, 130)",
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
  },
  sudokuText: {
    backgroundColor: "rgb(160, 220, 255)",
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
  },
  minesweeperText: {
    backgroundColor: "rgb(153, 255, 204)",
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
  },
  tttmText: {
    backgroundColor: "rgb(251, 151, 137)",
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
  },
  connect4Text: {
    backgroundColor: "rgb(194, 255, 154)",
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    padding: 10,
    borderRadius: 5,
  },
});
