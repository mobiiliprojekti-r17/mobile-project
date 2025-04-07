import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(211, 181, 255)",
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
    top: 140,
    right: 40, 
    backgroundColor: "rgb(177, 152, 216)",
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
  button: {
    backgroundColor: "rgb(177, 152, 216)", 
    width: 120,
    height: 45,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3, 
  },
  
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export const getTileStyle = (value) => {
  const tileColors = {
    0: { backgroundColor: "#e6f5ff", color: "#f9f6f2" },
    2: { backgroundColor: "rgb(211, 181, 255)", color: "#776e65" },
    4: { backgroundColor: "rgb(255, 158, 226)", color: "#776e65" },
    8: { backgroundColor: "rgb(251, 151, 137)", color: "#776e65" },
    16: { backgroundColor: "rgb(255, 199, 144)", color: "#776e65" },
    32: { backgroundColor: "rgb(255, 216, 130)", color: "#776e65" },
    64: { backgroundColor: "rgb(255, 246, 143)", color: "#776e65" },
    128: { backgroundColor: "rgb(194, 255, 154)", color: "#776e65" },
    256: { backgroundColor: "rgb(153, 255, 204)", color: "#776e65" },
    512: { backgroundColor: "rgb(160, 220, 255)", color: "#776e65" }, 
    1024: { backgroundColor: "rgb(140, 200, 255)", color: "#776e65" }, 
    2048: { backgroundColor: "rgb(180, 160, 255)", color: "#776e65" },
    default: { backgroundColor: "rgb(210, 175, 255)", color: "#776e65" },
  };

  return tileColors[value] || tileColors.default;
};
