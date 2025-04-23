import { StyleSheet, Dimensions} from "react-native";

// Haetaan näytön mitat
const { width, height } = Dimensions.get("window");

// Näytön koko ja marginaali – käytetään peliruudukon laatoissa
const tileSize = width * 0.2;
const tileMargin = width * 0.008;

export const styles = StyleSheet.create({
  // Pelin pääsäiliö, keskittää kaiken
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(211, 181, 255)",
  },
  // 2048 otsikko
  ChangaOneText: {
    fontFamily: 'ChangaOne_400Regular',
    fontSize: width * 0.25,
    fontWeight: "bold",
    color: "rgb(255, 255, 255)",
    marginBottom: height * 0.06,
  },
  // Piste- ja ajastinkomponenttien asettelu
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: width * 0.89,
    marginTop: height * 0.044,
    marginBottom: height * 0.005,
  },
  // Pisteteksti
  scoreText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#333",
  },
  // Ajastinteksti
  timerText: {
    fontSize: width * 0.045,
    fontWeight: "bold",
    color: "#333",
  },
  // Nappien asettelu
  topButtonsContainer: {
    position: "absolute",
    top: height * 0.317,
    right: width * 0.055,
    flexDirection: "row",
  },
  // Nappien säätö
  iconButton: {
    backgroundColor: "rgb(106, 106, 106)",
    padding: width * 0.014,
    borderRadius: width * 0.015,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: width * 0.02,
  },
  // Peliruudukon asettelu
  gridContainer: {
    backgroundColor: "#faf8ef",
    padding: width * 0.02,
    borderRadius: width * 0.025,
    borderWidth: 3,
    borderColor: "#fff",
    marginTop: height * 0.01,
  },
  // Yksi rivi peliruudukossa
  row: {
    flexDirection: "row",
  },
  // Yksittäinen pelilaatta
  tile: {
    width: tileSize,
    height: tileSize,
    margin: tileMargin,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: width * 0.01,
  },
  // Laatan sisällä oleva numero
  tileText: {
    fontSize: tileSize * 0.29,
    fontWeight: "bold",
  },
});

// Funktio, joka palauttaa laattojen värit arvon perusteella
export const getTileStyle = (value) => {
  const tileColors = {
    0: { backgroundColor: "#e6f5ff", color: "#f9f6f2" }, // tyhjä ruutu
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
    default: { backgroundColor: "rgb(176, 154, 255)", color: "#776e65" }, // kaikki loput laatat
  };

  return tileColors[value] || tileColors.default;
};
