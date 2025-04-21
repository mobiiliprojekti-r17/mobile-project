import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor:'#B09AFF'
  },
  title1: {
    fontSize: 70, 
    fontFamily: 'ConcertOne_400Regular',
    alignSelf: 'center',
    color: '#4A148C', 
  },
  title2: {
    fontSize: 40, 
    marginBottom: 20,
    fontFamily: 'ConcertOne_400Regular',
    alignSelf: 'center',
    color: '#4A148C', 
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 5,
  },
  statsBox: {
    backgroundColor: "rgba(74, 20, 140, 0.25)",
    borderRadius: 1,
    padding: 14,
    marginBottom: 20,
    alignItems: 'center',
    borderColor: "rgb(74, 20, 140)",
    borderWidth: 3,
    borderRadius: 10,
    width: '95%'
  },
  statusText: {
    fontSize: 25,
    color: '#4A148C', 
    fontFamily: 'ConcertOne_400Regular',
    marginLeft: 30,
    marginRight: 30,
  },
  bottleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  bottleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 1,
  },
  bottleWrapper: {
    width: width * 0.15,
    height: (width * 0.15) * 2.3,
    margin: 1,
    position: 'relative',
    borderBottomLeftRadius: (width * 0.15) * 0.27,   
    borderBottomRightRadius: (width * 0.15) * 0.27,  
    overflow: 'hidden', 
  },
  
  bottleInner: {
    flex: 1,
    backgroundColor: '#B09AFF',
    borderBottomLeftRadius: (width * 0.15) * 0.27,
    borderBottomRightRadius: (width * 0.15) * 0.27,
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
    height: ((width * 0.15) * 2.3) / 4,
    borderBottomWidth: 1,
    borderColor: '#aaa',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: -1,
    width: width,
    height: height,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  startButton: {
    backgroundColor: "rgb(74, 20, 140)",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  startButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'ConcertOne_400Regular',
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
    backgroundColor: '#4A148C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
    fontFamily: 'ConcertOne_400Regular',
  },
});
