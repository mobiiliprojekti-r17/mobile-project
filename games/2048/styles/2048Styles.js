import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#faf8ef",
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
    fontSize: 32,
    fontWeight: "bold",
  },
});

// Funktio, joka palauttaa laatalle oikean tyylin arvon perusteella
export const getTileStyle = (value) => {
  const tileColors = {
    0: { backgroundColor: "#e6f5ff", color: "#f9f6f2" },
    2: { backgroundColor: "rgb(252, 158, 158)", color: "#776e65" },
    4: { backgroundColor: "rgb(255, 134, 134)", color: "#776e65" },
    8: { backgroundColor: "rgb(255, 197, 135)", color: "#f9f6f2" },
    16: { backgroundColor: "rgb(255, 175, 88)", color: "#f9f6f2" },
    32: { backgroundColor: "rgb(251, 222, 116)", color: "#f9f6f2" },
    64: { backgroundColor: "rgb(255, 216, 75)", color: "#f9f6f2" },
    128: { backgroundColor: "rgb(137, 225, 152)", color: "#f9f6f2" },
    256: { backgroundColor: "rgb(117, 221, 134)", color: "#f9f6f2" },
    512: { backgroundColor: "rgb(77, 171, 247)", color: "#f9f6f2" },
    1024: { backgroundColor: "rgb(77, 171, 247)", color: "#f9f6f2" },
    2048: { backgroundColor: "rgb(208, 191, 255)", color: "#f9f6f2" },
    default: { backgroundColor: "rgb(208, 191, 255)", color: "#f9f6f2" }, // Suuremmat numerot
  };

  return tileColors[value] || tileColors.default;
};
