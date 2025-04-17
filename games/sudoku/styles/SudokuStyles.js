import { Dimensions, StyleSheet } from 'react-native';
 
const { width, height } = Dimensions.get("window");
const buttonsPerRow = 3;
const containerWidth = width * 0.80;
const spacing = width * 0.05;
const totalSpacing = spacing * (buttonsPerRow - 1);
const buttonWidth = (containerWidth - totalSpacing) / buttonsPerRow;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgb(160, 220, 255)",
      padding: 10,
    },
    title: {
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#2162aa",
    },
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 20,
        marginBottom: 10,
        marginTop: 20,
      },
      difficultyText: {
        fontSize: 18,
        fontWeight: "bold",
         color: "#2162aa",
      },
      timerText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#2162aa",
      },
    row: {
      flexDirection: "row",
    },
    preFilledCellText: {
        color: "back", // Tummemman harmaa väri
        fontWeight: 'bold' // Lihavoitu
      },
      userAddedNumberText: {
        color: "blue", // Sininen väri
      },
    
    cell: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1, // Ohut reunaviiva
        borderColor: "black",
        backgroundColor: "white", // Oletusvalkoinen
      },
      boldTop: { borderTopWidth: 3 },
      boldLeft: { borderLeftWidth: 3 },
      boldRight: { borderRightWidth: 3 },
      boldBottom: { borderBottomWidth: 3 },
      blueCell: { backgroundColor: "rgb(188, 231, 255)" }, 

      selectedCell: {
        backgroundColor: "rgb(127, 203, 244)",
      },
      
    cellText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    largeBoxBorder: {
      borderColor: "black",
      borderWidth: 2,
    },
    centerBoxBorder: {
      borderColor: "black",
      borderWidth: 2,
    },
    numberPad: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      marginTop: 10,
      marginBottom: 10,
    },
    numberButton: {
        width: 70,
        height: 40,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgb(188, 231, 255)" ,
      margin: 2,
      borderRadius: 5,
      borderColor: "rgb(0, 0, 0)",
      borderWidth: 2,
      marginLeft: 5,
      marginRight: 5,
    },
    numberButtonText: {
      color: "black",
    },
    numberButtonDisabled: {
      backgroundColor: '#ccc',
      borderColor:   '#888',
    },    

    numberPadBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'column',      /* sisällä sekä numero‑rivi että toggle */
    alignItems: 'center',
    marginVertical: 10,
    width: "70%",
   },

  noteToggleBox: {
  flexDirection: 'row',
  justifyContent: 'center',
  marginTop: 10,
  },

      clearButton: {
        width: 70,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(188, 231, 255)" ,
        margin: 5,
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
        borderColor: "rgb(0, 0, 0)",
        borderWidth: 2,
      },

      CheckButton:{
        width: 150,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(188, 231, 255)" ,
        margin: 5,
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
        borderColor: "rgb(0, 0, 0)",
        borderWidth: 2,
      },
      InfoButton: {
        width: 70,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgb(188, 231, 255)" ,
        margin: 5,
        borderRadius: 5,
        marginLeft: 5,
        marginRight: 5,
        borderRadius: 5,
        borderColor: "rgb(0, 0, 0)",
        borderWidth: 2,
      },
      ModalInfoText:{
        fontSize: width * 0.045,
        fontWeight: "bold",
        marginBottom: height * 0.02,
        textAlign: "center",
        color: "rgb(33, 131, 184)",
      },
  ModeButton: {
    minWidth: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(188, 231, 255)",
    margin: 5,
    borderRadius: 5,
    borderColor: "#000",
    borderWidth: 2,
  },
  ModeButtonText: {
    color: "black",    // pienellä c!
  },
  // uusi tyyli aktiiviselle napille
  ModeButtonActive: {
    backgroundColor: "rgb(33, 131, 184)",  // tummansininen
  },
  ModeButtonTextActive: {
    color: "white",    // jos haluat vaalean tekstin
  },
 

    cellError: {
        backgroundColor: "rgb(33, 131, 184)",
      },
      ButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        width: '100%',
      },
      Homebutton: {
        backgroundColor: "rgb(33, 131, 184)", 
        width: 100,
        height: 50,
      justifyContent: "center",
      alignItems: "center",
      margin: 5,
      borderRadius: 5,
      marginLeft: 10,
      marginRight: 10,
      },
      
      HomebuttonText: {
        color: '#fff', // White text on buttons for contrast
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
      },

      Restartbutton: {
        backgroundColor: "rgb(33, 131, 184)", 
        width: 100,
        height: 50,
      justifyContent: "center",
      alignItems: "center",
      margin: 5,
      borderRadius: 5,
      marginLeft: 10,
      marginRight: 10,
      },
      
      RestartbuttonText: {
        color: '#fff', // White text on buttons for contrast
        fontSize: 18,
        textAlign: 'center',
        fontWeight: 'bold',
      },
        // Modaalin taustalla oleva läpinäkyvä overlay
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  // Modaalin varsinainen laatikko
  modalView: {
    margin: 20,
    backgroundColor: "rgb(160, 220, 255)",
    padding: width * 0.05,
    borderRadius: 12,
    alignItems: "stretch",
    width: width * 0.7,
    elevation: 5,
  },
  // Modaalin tekstiviesti

  // Yleinen nappityyli modaalin napille
  button: {
    backgroundColor: "rgb(33, 131, 184)",
    paddingVertical: height * 0.01,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.007,
  },
  // Sulje‑nappi modaalissa (vaaleansininen tausta)
  buttonClose: {
    backgroundColor: "rgb(33, 131, 184)",
  },
  // Nappitekstin tyyli modaalissa
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  modalText: {
    fontSize: width * 0.07,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    textAlign: "center",
    color: "rgb(33, 131, 184)",
  },

 

  });
  export default styles;