import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Tumma overlay, joka peittää taustan modalin aikana
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

  // Sisältökupla modalin sisällä (yleinen)
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

  // Modalin pääotsikkoteksti
  modalText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "white",
    fontFamily: 'FredokaOne_400Regular',
  },

  // Yleinen modalin nappityyli
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },

  // Modalin nappiteksti
  modalButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: 'FredokaOne_400Regular',
  },

  // Overlay-variantti käytetään joissakin modaleissa
  overlay: {
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

  // Kontaier vaikeustason valinnan modalissa
  container: {
    backgroundColor: "rgb(255, 234, 0)", 
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },

  // Modalin otsikko 
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "black",
    fontFamily: 'FredokaOne_400Regular',
  },

  // Nappi modalin sisällä 
  button: {
    backgroundColor: "#fbc02d", 
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'stretch',
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },

  // Teksti modalin nappien päällä
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: 'FredokaOne_400Regular',
  },
});
