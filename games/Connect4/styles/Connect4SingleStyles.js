import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgb(255, 246, 143)", 
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    color: '#3b2a3a',  
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
player: {
  fontSize:20,
marginBottom: 10,
},
  winnerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b2a3a', 
    marginTop: 10,
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
    borderRadius: 22.5,
  },
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor:"rgb(255, 204, 0)", 
    borderRadius: 5,
  },
  buttonText: {
    color: 'white', 
    fontSize: 18,
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
},
});
