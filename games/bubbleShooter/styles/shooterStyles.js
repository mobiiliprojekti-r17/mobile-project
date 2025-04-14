import { StyleSheet } from 'react-native';

const shooterStyles = StyleSheet.create({
  shooterBall: {
    position: 'absolute',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
     marginTop:40
  },
  face: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  shooterGameContainer: {
    flex: 1,
    backgroundColor:  "rgb(255, 158, 226)", 
    alignItems: 'center',
    justifyContent: 'center',
    height: "120%",
  },
  shooterScoreText: {
    textAlign: "center" ,
    position: 'absolute',
    top: 10,
    fontSize: 45,
    color: '#6C5DD3', 
    textShadowColor: '#8EA7E9', 
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    marginTop: 40,
    fontFamily: 'CuteFont_400Regular',
  },
  ShooterScreenContainer: {
    flex: 1,
    paddingBottom: 80, 
    backgroundColor: 'rgb(255, 158, 226)'
  },
  shooterHomeButtonContainer: {
    position: 'absolute',
    top: 55,
    left: 100,
    zIndex: 10,
  },
  shooterHomeIcon: {
    fontSize: 32,
    color: '#6C5DD3',
  },
});


export default shooterStyles;
