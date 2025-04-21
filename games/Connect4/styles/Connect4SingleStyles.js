import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgb(255, 246, 143)", 
  },
  title: {
    fontSize: 65,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
    color: '#3b2a3a', 
    fontFamily: 'FredokaOne_400Regular',
  },
  title2: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#3b2a3a', 
    fontFamily: 'FredokaOne_400Regular',
  },
  player: {
  fontSize:25,
  marginBottom: 10,
  fontFamily: 'FredokaOne_400Regular',
},

  board: {
    backgroundColor: "rgb(255, 204, 0)", 
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
    backgroundColor: "rgb(255, 246, 143)",
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
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor:"rgb(255, 204, 0)", 
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center', 
    marginHorizontal: 8, 
  },
  buttonText: {
    color: 'white', 
    fontSize: 20,
    fontFamily: 'FredokaOne_400Regular',
  },
// Modal styles
modalOverlay: {
  position: "absolute", 
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  flex: 1,
  justifyContent: "center", 
  alignItems: "center", 
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  zIndex: 100, 
},

modalContent: {
  backgroundColor: "rgb(255, 204, 0)",
  padding: 20,
  borderRadius: 12,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 4,
  elevation: 5,
},

modalText: {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 15,
  textAlign: "center",
  color: "white",
  fontFamily: 'FredokaOne_400Regular',
},

modalButton: {
  paddingHorizontal: 20,
  paddingVertical: 10,
  borderRadius: 8,
},

modalButtonText: {
  color: "white",
  fontSize: 16,
  fontWeight: "bold",
  fontFamily: 'FredokaOne_400Regular',
},
});
