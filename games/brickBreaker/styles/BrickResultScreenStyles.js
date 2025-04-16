import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(192, 253, 111)",
    paddingHorizontal: width * 0.05,
    paddingTop: height * 0.05,
    paddingBottom: height * 0.02,
  },
  title: {
    fontFamily: "PressStart2P-Regular",
    fontSize: width * 0.085,
    textAlign: "center",
    marginBottom: height * 0.02,
    paddingTop: height * 0.05,
  },
  resultBox: {
    alignItems: "center",
    marginBottom: height * 0.015,
  },
  resultText: {
    fontSize: width * 0.07,
    fontFamily: "VT323_400Regular",
    fontWeight: "bold",
    marginBottom: 5,
    padding: 0.1,
  },
  topListTitle: {
    fontFamily: "PressStart2P-Regular",
    fontSize: width * 0.05,
    textAlign: "center",
    marginBottom: 11,
  },
  scrollView: {
    flex: 1,
    marginBottom: 24,
  },
  resultItem: {
    width: width * 0.7,
    alignSelf: "center",
    marginBottom: 10,
    padding: 0.6,
    backgroundColor: "rgba(160, 231, 68, 0.87)",
    borderRadius: 5,
  },
  resultItemText: {
    fontSize: width * 0.061,
    fontFamily: "VT323_400Regular",
    fontWeight: "bold",
    textAlign: "center",
  },
  homeButton: {
    backgroundColor: "rgb(160, 231, 68)",
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 0.00001,
    marginBottom: 20,
  },
  homeButtonText: {
    color: "black",
    fontFamily: "PressStart2P-Regular",
    fontSize: width * 0.038,
  },
});

export default styles;
