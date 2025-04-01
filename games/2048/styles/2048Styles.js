import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faf8ef",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "81%",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  timerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  undoButtonContainer: {
    position: "absolute",
    top: 175,
    right: 40, 
    backgroundColor: "rgb(106, 106, 106)",
    padding: 5, 
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
},

  row: {
    flexDirection: "row",
  },
  tile: {
    width: 80,
    height: 80,
    margin: 5,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  tileText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  resultContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faf8ef",
  },
  resultText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
});



// Funktio, joka palauttaa laatalle oikean tyylin arvon perusteella
export const getTileStyle = (value) => {
  const tileColors = {
    0: { backgroundColor: "#e6f5ff", color: "#f9f6f2" },
    2: { backgroundColor: "rgb(211, 181, 255)", color: "#776e65" }, // Vaaleampi laventeli 
    4: { backgroundColor: "rgb(255, 182, 193)", color: "#776e65" }, // Vaaleanpunainen
    8: { backgroundColor: "rgb(251, 151, 137)", color: "#776e65" }, // Vaaleampi punainen
    16: { backgroundColor: "rgb(255, 199, 144)", color: "#776e65" }, // Persikkaisempi
    32: { backgroundColor: "rgb(255, 216, 130)", color: "#776e65" }, // Selkeämpi oranssi
    64: { backgroundColor: "rgb(255, 246, 143)", color: "#776e65" }, // Keltainen
    128: { backgroundColor: "rgb(194, 255, 154)", color: "#776e65" }, // Limenvihreä
    256: { backgroundColor: "rgb(153, 255, 204)", color: "#776e65" }, // Mintunvihreä
    512: { backgroundColor: "rgb(160, 220, 255)", color: "#776e65" },  // Erottuvampi taivaansininen  
    1024: { backgroundColor: "rgb(140, 200, 255)", color: "#776e65" }, // Syvempi pastellinsininen  
    2048: { backgroundColor: "rgb(180, 160, 255)", color: "#776e65" }, // Erottuvampi violetti  
    default: { backgroundColor: "rgb(210, 175, 255)", color: "#776e65" }, // Vaalea violetti
  };

  return tileColors[value] || tileColors.default;
};
