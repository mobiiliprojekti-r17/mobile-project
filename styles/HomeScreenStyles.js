import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "lightblue",
    paddingBottom: 40,
  },

  title: {
    fontSize: 35,
    fontFamily: 'PressStart2P_400Regular',
    fontWeight: "bold",
    marginTop: 80,
    marginBottom: 20,
    color: "#222",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },

  input: {
    width: "80%",
    height: 42,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "white",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
    marginBottom: 20,
  },

  button: {
    backgroundColor: "rgb(58, 226, 255)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginHorizontal: 5,
    elevation: 3,
    marginRight: 20,
    marginLeft: 20,
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },

  gameSection: {
    width: "95%",
    backgroundColor: "rgba(186, 245, 255, 0.73)",
    borderRadius: 18,
    padding: 15,
    marginBottom: 20,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  fullScreen: {
    flex: 1,
    backgroundColor: 'lightblue',
  },
  
  scrollContainer: {
    flex: 1, 
  },
  
  gameButtonsContainer: {
    flexDirection: 'row',     
    flexWrap: 'wrap',          
    justifyContent: 'center', 
    alignItems: 'center',     
  },
  
  // Game buttons
  g2048Button: {
    backgroundColor: "rgb(211, 181, 255)",
    padding: 12,
    borderRadius: 10,
    margin: 6, 
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  gameButtonText: {
    color: "white",
    fontSize: 14,  
    fontWeight: "600",
    textAlign: "center", 
  },
  ShooterButton: {
    backgroundColor: "rgb(255, 158, 226)",
    padding: 12,
    borderRadius: 10,
    margin: 6,
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  BreakerButton: {
    backgroundColor: "rgb(192, 253, 111)",
    padding: 12,
    borderRadius: 10,
    margin: 6,
    width: '30%',
    aspectRatio: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  TTTSButton: {
    backgroundColor: "rgb(255, 216, 130)",
    padding: 12,
    borderRadius: 10,
    margin: 6,
    width: '30%',
    aspectRatio: 1,  
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  SudokuButton: {
    backgroundColor: "rgb(160, 220, 255)",
    padding: 12,
    borderRadius: 10,
    margin: 6,
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  MinesweeperButton: {
    backgroundColor: "rgb(153, 255, 204)",
    padding: 12,
    borderRadius: 10,
    margin: 6,
    width: '30%',
    aspectRatio: 1,  
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  TTTMButton: {
    backgroundColor: "rgb(251, 151, 137)",
    padding: 12,
    borderRadius: 10,
    margin: 6,
    width: '30%',
    aspectRatio: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  Connect4Button: {
    backgroundColor: "rgb(255, 199, 144)",
    padding: 12,
    borderRadius: 10,
    margin: 6,
    width: '30%',
    aspectRatio: 1,  
    justifyContent: 'center', 
    alignItems: 'center', 
  },

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
    backgroundColor: 'lightblue',
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

  ModalButton: {
    backgroundColor: "rgb(58, 226, 255)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  ModalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: 'center'
  },
  difficultyModalContent: {
    backgroundColor: 'lightblue',
    padding: 20,
    borderRadius: 12,
    alignItems: "stretch", 
    width: "80%", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "space-between",
  },
  
  difficultyModalButton: {
    backgroundColor: "rgb(58, 226, 255)",
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%", 
    alignItems: "center", 
    justifyContent: "center", 
    marginVertical: 5, 
  },

  difficultyModalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});