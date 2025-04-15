import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgb(255, 199, 144)", 
  },
  title: {
    fontSize: 60,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: '#3b2a3a', 
    fontFamily: 'FredokaOne_400Regular',
  },
player: {
  fontSize:25,
marginBottom: 10,
fontFamily: 'FredokaOne_400Regular',
},
  board: {
    backgroundColor: "rgb(252, 128, 4)", 
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cell: {
    width: 40,
    height: 40,
    backgroundColor: "rgb(255, 199, 144)",
    borderRadius: 25,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disc: {

      width: 40,
      height: 40,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 2,
      elevation: 3,
  
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor:"rgb(252, 128, 4)", 
    borderRadius: 5,
  },
  buttonText: {
    color: 'white', 
    fontSize: 20,
    fontFamily: 'FredokaOne_400Regular',
  },

});
