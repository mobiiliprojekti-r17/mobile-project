import { StyleSheet } from "react-native";

const modalStyles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, 
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#B09AFF",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    borderColor: 'rgb(74, 20, 140)',
    borderWidth: 4,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: 'ConcertOne_400Regular',
    color: 'rgb(74, 20, 140)',
  },
  modalMessage: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 15,
    fontFamily: 'ConcertOne_400Regular',
    color: 'rgb(74, 20, 140)',
  },
  modalButton: {
    backgroundColor: "rgb(74, 20, 140)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    fontSize: 25,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: 'ConcertOne_400Regular',
  },
});

export default modalStyles;
