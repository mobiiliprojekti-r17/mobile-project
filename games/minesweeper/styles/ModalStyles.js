import { StyleSheet } from "react-native";

const ModalStyles = StyleSheet.create({
  // Tumma taustakerros modalin takana, estää klikkaukset alla olevaan sisältöön
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
  // Pääkentän sisältökupla modaalissa
  modalContent: {
    backgroundColor: "rgb(63, 210, 136)",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // Yleinen modaalin otsikkoteksti
  modalText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "white",
    fontFamily: "Bungee_400Regular",
  },
  // Yleinen modaalin sulkupainike
  modalButton: {
    backgroundColor: "rgb(56, 180, 118)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  // Yleisen modaalin napin teksti
  modalButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Bungee_400Regular",
  },
  // Sisältökupla vaikeustason valinnalle
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
  // Nappi vaikeustason valitsemiseen modalissa
  difficultyModalButton: {
    backgroundColor: "rgb(56, 180, 118)",
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%", 
    alignItems: "center", 
    justifyContent: "center", 
    marginVertical: 5, 
  },
  // Otsikko modaalin eri tyypeille
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "rgb(255, 255, 255)",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginBottom: 20,
    fontFamily: "Bungee_400Regular",
  },
  // Kontti ohjeteksteille modaalissa
  instructionContent: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  // Yksittäinen ohjeteksti rivi modaalissa
  instruction: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgb(52, 168, 110)",
    fontFamily: "Bungee_400Regular",
    textAlign: "left",
    alignSelf: "flex-start",
  },
  // Sulje-ohjemodal-nappi
  instructionbutton: {
    backgroundColor: "rgb(52, 168, 110)",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    marginTop:20,
  },
  // Ohjenapin tekstin tyyli
  instructionbuttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Bungee_400Regular",
  },
});

export default ModalStyles;
