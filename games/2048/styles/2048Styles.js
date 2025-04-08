import { StyleSheet, Dimensions} from "react-native";

const screenWidth = Dimensions.get("window").width;
const gridPadding = 60; // marginaalia sivuilta
const tileMargin = 5;
const tilesPerRow = 4;
const baseWidth = 390;
const scale = screenWidth / baseWidth;

const tileSize = (screenWidth - gridPadding - tileMargin * 2 * tilesPerRow) / tilesPerRow;
const scaleSize = (size) => Math.round(size * scale);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(211, 181, 255)", //"#faf8ef"
  },
  ChangaOneText: {
    fontFamily: 'ChangaOne_400Regular',
    fontSize: scaleSize(80),
    fontWeight: "bold",
    color: "rgb(255, 255, 255)",
    marginBottom: scaleSize(50),
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "89%",
    marginTop: scaleSize(25),
    marginBottom: scaleSize(5),
  },
  scoreText: {
    fontSize: scaleSize(18),
    fontWeight: "bold",
    color: "#333",
  },
  timerText: {
    fontSize: scaleSize(18),
    fontWeight: "bold",
    color: "#333",
  },
  topButtonsContainer: {
    position: "absolute",
    top: scaleSize(260),
    right: scaleSize(25),
    flexDirection: "row",
  },
  
  iconButton: {
    backgroundColor: "rgb(106, 106, 106)",
    padding: scaleSize(5),
    borderRadius: scaleSize(5),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scaleSize(8),
  },
  
gridContainer: {
  backgroundColor: "#faf8ef",
  padding: 8,
  borderRadius: 10,
  borderWidth: 3,
  borderColor: "#fff", // vaalea reunaväri
  marginTop: 10,
},

  row: {
    flexDirection: "row",
  },
  tile: {
    width: tileSize,
    height: tileSize,
    margin: tileMargin,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  tileText: {
    fontSize: tileSize * 0.3,
    fontWeight: "bold",
  },
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
    512: { backgroundColor: "rgb(168, 223, 255)", color: "#776e65" }, 
    1024: { backgroundColor: "rgb(137, 197, 253)", color: "#776e65" }, 
    2048: { backgroundColor: "rgb(176, 154, 255)", color: "#776e65" },
    default: { backgroundColor: "rgb(210, 175, 255)", color: "#776e65" },
  };

  return tileColors[value] || tileColors.default;
};
