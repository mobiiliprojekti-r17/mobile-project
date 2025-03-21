import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: 'lightblue',
      padding: 10,
    },
      header: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 20,
        marginBottom: 10,
      },
      difficultyText: {
        fontSize: 18,
        fontWeight: "bold",
      },
      timerText: {
        fontSize: 18,
        fontWeight: "bold",
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
      grayCell: { backgroundColor: "#d3d3d3" }, // Harmaa tausta

      selectedCell: {
        backgroundColor: "lightblue",
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
      marginTop: 20,
      marginRight: 20,
      marginLeft: 10,
    },
    numberButton: {
        width: 70,
        height: 40,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#C8A2C8",
      margin: 5,
      borderRadius: 5,
      marginLeft: 20,
      marginRight: 10,
    },

      numberPadContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
      },

      clearButton: {
        width: 70,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#C8A2C8",
        margin: 5,
        borderRadius: 5,
        marginLeft: 20,
        marginRight: 10,
      },

      CheckButton:{
        width: 170,
        height: 40,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#C8A2C8",
      margin: 5,
      borderRadius: 5,
      marginLeft: 20,
      marginRight: 10,
      },

    cellError: {
        backgroundColor: 'red',
      },
  });
  export default styles;