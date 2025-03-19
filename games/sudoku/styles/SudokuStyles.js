import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f8f8f8",
      padding: 10,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 20,
      color: "#333",
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
    },
    numberButton: {
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#4CAF50",
      margin: 5,
      borderRadius: 5,
    },
    numberText: {
      fontSize: 18,
      color: "#fff",
    },
    clearButton: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#4CAF50",
        margin: 5,
        borderRadius: 5,
      },
      clearButtonText: {
        fontSize: 18,
        color: "#fff",
      },
    buttonContainer: {
      flexDirection: "row",
      marginTop: 20,
    },
    button: {
      marginHorizontal: 10,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    cellError: {
        backgroundColor: 'red',
        borderColor: 'darkred',
      },
  });
  export default styles;