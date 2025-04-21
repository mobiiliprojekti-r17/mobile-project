import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(153, 255, 204)",
  },
  header: {
    flexDirection: "row",       
    justifyContent: "space-between", 
    alignItems: "center",      
    width: "100%",
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  difficultyText: {
    fontSize: 27,
    fontWeight: "bold",
    color: "rgb(63, 210, 136)",
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    flex: 1,                
    textAlign: "center",  
    fontFamily: "VT323_400Regular",
  },
  timerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "rgb(63, 210, 136)",
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    flex: 1,                
    textAlign: "center", 
    fontFamily: "VT323_400Regular", 
  },
  mineCountText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "rgb(63, 210, 136)",
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    flex: 1,                 
    textAlign: "center",  
    fontFamily: "VT323_400Regular",
  },
  title: {
    fontSize: 70,
    fontWeight: "bold",
    color: "rgb(63, 210, 136)",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginBottom: 40,
    fontFamily: "VT323_400Regular",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    backgroundColor: "rgb(63, 210, 136)",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',  
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "VT323_400Regular",
  },
  resultButton: {
    backgroundColor: "rgb(63, 210, 136)",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  resultButtonText: {
    color: "#fff",
    fontSize: 20,
    fontFamily: "VT323_400Regular",
  },



});

export default styles;