import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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
