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
    2: { backgroundColor: "#b3e0ff", color: "#776e65" },
    4: { backgroundColor: "#80ccff", color: "#776e65" },
    8: { backgroundColor: "#66c2ff", color: "#f9f6f2" },
    16: { backgroundColor: "#33adff", color: "#f9f6f2" },
    32: { backgroundColor: "#0099ff", color: "#f9f6f2" },
    64: { backgroundColor: "#007acc", color: "#f9f6f2" },
    128: { backgroundColor: "#005c99", color: "#f9f6f2" },
    256: { backgroundColor: "#003d66", color: "#f9f6f2" },
    512: { backgroundColor: "#002e4d", color: "#f9f6f2" },
    1024: { backgroundColor: "#001f33", color: "#f9f6f2" },
    2048: { backgroundColor: "#000f1a", color: "#f9f6f2" },
    default: { backgroundColor: "#3c3a32", color: "#f9f6f2" }, // Suuremmat numerot
  };

  return tileColors[value] || tileColors.default;
};
