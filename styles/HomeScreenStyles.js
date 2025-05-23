import { Dimensions, StyleSheet } from 'react-native';
// Haetaan laitteen koko näytön mitat
const { width, height } = Dimensions.get("window");
// Lasketaan nappien leveys dynaamisesti ruudun koon mukaan
const buttonsPerRow = 3;
const containerWidth = width * 0.80;
const spacing = width * 0.05;
const totalSpacing = spacing * (buttonsPerRow - 1);
const buttonWidth = (containerWidth - totalSpacing) / buttonsPerRow;
 
export default StyleSheet.create({
  //Kontainerin perusasettelu
  container: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "rgb(157, 226, 255)",
  },
  //Logon tyyli
  logoImage: {
    width: width,
    height: height * 0.29,
    marginTop: -5,
  },

inputRow: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: height * 0.015,
},
//Nimimerkkikentän tyyli
input: {
  flex: 1,
  height: height * 0.045,
  borderColor: "rgb(127, 0, 255)",
  borderWidth: 2,
  borderRadius: 8,
  paddingHorizontal: width * 0.03,
  backgroundColor: "rgb(204, 159, 254)",
  color: "rgb(127, 0, 255)",
  fontFamily: 'CuteFont_400Regular',
  fontSize: width * 0.08,
  marginBottom: 0,
  marginLeft: width * 0.05,   
},
//Clear-napin tyyli
button: {
  height: height * 0.045,
  justifyContent: 'center',
  paddingHorizontal: width * 0.045,
  backgroundColor: "rgb(127, 0, 255)",
  borderRadius: 8,
  borderWidth: 2,
  borderColor: "rgb(127, 0, 255)",
  marginLeft: width * 0.03,   
  marginRight: width * 0.05,   
  elevation: 3,
},

//Clear tekstin tyyli
buttonText: {
  color: "white",
  fontSize: width * 0.075,
  fontWeight: "bold",
  textAlign: "center",
  fontFamily: 'CuteFont_400Regular',
},
//Pelisektion kontainerin tyyli
  gameSection: {
    width: width * 0.9,
    backgroundColor: "rgb(252, 130, 240)",
    borderColor: "rgb(127, 0, 255)",
    borderWidth: 2,
    borderRadius: 18,
    marginBottom: height * 0.025,
    borderRadius: 10,
  },
  //Otsikko
  sectionTitle: {
    fontSize: width * 0.10,
    fontWeight: "bold",
    color: "#333",
    marginBottom: height * 0.02,
    marginTop: height * 0.012,
    textAlign: "center",
    fontFamily: 'CuteFont_400Regular',
    color: "rgb(127, 0, 255)"
  },
  // Gradientin koko näkymän koko
  fullScreen: {
    flex: 1,
    width: width,
    height: height,
  },
  scrollContainer: {
    flex: 1,
  },
  // Yksinpelien nappirivien asettelu
  gameButtonsContainerSingleplayer: {
    width: containerWidth,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  // Moninpelin nappirivin asettelu
  gameButtonsContainerMultiplayer: {
    flexDirection: 'row',
    justifyContent: 'center',  
    alignItems: 'center',
  },
  //Kuva
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
  },
  // Yksinpelin nappien tyyli
  gameButtonSingleplayer: {
    width: buttonWidth,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "rgb(127, 0, 255)",
    borderWidth: 2,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: height * 0.02,
  },
  // Moninpelin nappien tyyli
  gameButtonMultiplayer: {
    width: buttonWidth,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "rgb(127, 0, 255)",
    borderWidth: 2,
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: height * 0.02,
    marginHorizontal: width * 0.06,
  },
  //Modaalin tausta
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
  //Modaali-ikkunan sisältö
  modalContent: {
    backgroundColor: "rgb(204, 159, 254)",
    padding: width * 0.05,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    borderColor: "rgb(128, 0, 255)",
    borderWidth: 2,
    borderRadius: 10,
  },
  //Modaali-tekstin tyyli
  modalText: {
    fontSize: width * 0.085,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    textAlign: "center",
    color: "rgb(127, 0, 255)",
    fontFamily: 'CuteFont_400Regular',
  },
  //Modaali-napin tyyli
  ModalButton: {
    backgroundColor: "rgb(127, 0, 255)",
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.01,
    borderRadius: 8,
  },
  //Napin tekstin tyyli
  ModalButtonText: {
    color: "white",
    fontSize: width * 0.06,
    fontWeight: "bold",
    textAlign: 'center',
    fontFamily: 'CuteFont_400Regular',
  },
  // Vaikeustasovalintamodaalin sisältö
  difficultyModalContent: {
    backgroundColor: "rgb(204, 159, 254)",
    padding: width * 0.05,
    borderRadius: 12,
    alignItems: "stretch",
    width: width * 0.8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    justifyContent: "space-between",
    borderColor: "rgb(127, 0, 255)",
    borderWidth: 5,
    borderRadius: 10,
  },
  // Vaikeustason nappien tyyli
  difficultyModalButton: {
    backgroundColor: "rgb(127, 0, 255)",
    paddingVertical: height * 0.01,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.007,
  },
  difficultyModalButtonText: {
    color: "white",
    fontSize: width * 0.07,
    fontWeight: "bold",
    fontFamily: 'CuteFont_400Regular',
  },
});
