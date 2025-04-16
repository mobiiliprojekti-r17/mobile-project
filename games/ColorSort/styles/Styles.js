import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor:'#B09AFF'
  },
  title: {
    fontSize: 24, 
    marginBottom: 20 
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10
  },
  statusText: {
    fontSize: 18,
    color: '#333'
  },
  bottleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
  },
  bottleWrapper: {
    // pienempi koko: noin 15% näytön leveydestä
    width: width * 0.15,
    // säilytä korkeus/leveys‑suhde ~160/70 ≈ 2.3
    height: (width * 0.15) * 2.3,
    margin: 5,
    position: 'relative',
  },
  bottleInner: {
    flex: 1,
    backgroundColor: '#B09AFF',
    borderBottomLeftRadius: (width * 0.15) * 0.26,
    borderBottomRightRadius: (width * 0.15) * 0.26,
    overflow: 'hidden',
  },
  bottleBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1.5,
    borderColor: '#000',
    borderBottomLeftRadius: (width * 0.15) * 0.26,
    borderBottomRightRadius: (width * 0.15) * 0.26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  layer: {
    // kerroksen korkeus mukautuu nyt korkeuteen
    height: ((width * 0.15) * 2.3) / 4,
    borderBottomWidth: 1,
    borderColor: '#aaa',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  startButton: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    paddingHorizontal: 40,
    borderRadius: 10
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000'
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(129, 113, 187)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
});
