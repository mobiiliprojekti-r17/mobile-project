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
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 20,
    marginBottom:10,
  },

  difficultyText: {
    fontSize: 18,
    fontWeight: "bold",
     color: "rgb(63, 210, 136)",
     marginRight: 10,
     textShadowColor: 'black',
     textShadowOffset: { width: 1, height: 1 },
     textShadowRadius: 1,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgb(63, 210, 136)",
    marginLeft: 10,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color:'rgb(63, 210, 136)', 
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginBottom: 40,
  },

  gameOverText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "red",
    padding: 10,
    borderRadius: 5,
    top: 50,  // Adjust to where you want the text to appear
    zIndex: 10,  // Ensure the game over text is on top
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

//modal
modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
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
  }
  
  
});
