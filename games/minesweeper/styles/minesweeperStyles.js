import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(153, 255, 204)",
  },
  header: {
    flexDirection: "row",       
    justifyContent: "space-between", 
    alignItems: "center",      
    width: "100%",
    paddingHorizontal: 20,
    marginBottom: 10,
  },

  difficultyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgb(63, 210, 136)",
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    flex: 1,                
    textAlign: "center",  
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgb(63, 210, 136)",
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    flex: 1,                
    textAlign: "center",  
  },
  mineCountText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgb(63, 210, 136)",
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    flex: 1,                 
    textAlign: "center",  
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'rgb(63, 210, 136)',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginBottom: 40,
  },
  
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    backgroundColor: "rgb(63, 210, 136)",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  resultButton: {
    backgroundColor: "rgb(63, 210, 136)",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  resultButtonText: {
    color: "#fff",
    fontSize: 16,
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
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "white",
  },

  modalButton: {
    backgroundColor: "rgb(56, 180, 118)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // Difficulty modal
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
    fontSize: 16,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  instruction: {
    fontSize: 16,
    marginVertical: 4,
    textAlign: "center",
  },
  button: {
    marginTop: 20,
    backgroundColor: "rgb(63, 210, 136)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft:5,
    marginRight:5,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },

});
