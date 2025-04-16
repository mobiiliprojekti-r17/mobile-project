import { StyleSheet } from "react-native";

const ModalStyles = StyleSheet.create({
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
    backgroundColor: "rgb(63, 210, 136)",
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
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "white",
    fontFamily: "VT323_400Regular",
  },
  modalButton: {
    backgroundColor: "rgb(56, 180, 118)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "VT323_400Regular",
  },
  difficultyModalContent: {
    backgroundColor: "rgb(63, 210, 136)",
    padding: 20,
    borderRadius: 12,
    alignItems: "stretch", 
    width: "80%", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  difficultyModalButton: {
    backgroundColor: "rgb(56, 180, 118)",
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%", 
    alignItems: "center", 
    justifyContent: "center", 
    marginVertical: 5, 
  },
  difficultyModalButtonText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "VT323_400Regular",
  },
  title: {
    fontSize: 60,
    fontWeight: "bold",
    color: "rgb(255, 255, 255)",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginBottom: 20,
    fontFamily: "VT323_400Regular",
  },
  instruction: {
    fontSize: 25,
    fontWeight: "bold",
    color: "rgb(255, 255, 255)",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    fontFamily: "VT323_400Regular",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  
  instructionbutton: {
    backgroundColor: "rgb(52, 168, 110)",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    marginTop:20,
  },
  instructionbuttonText: {
    color: "white",
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "VT323_400Regular",
  },
});

export default ModalStyles;