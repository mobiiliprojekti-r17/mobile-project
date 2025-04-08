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
    fontSize: 24,
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
  },
  
  shooterButton: {
    backgroundColor: "rgb(253, 122, 214)", 
    width: 100,
    height: 45,
    borderRadius: 8,
    elevation: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  shooterButtonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  shooterFooter: {
    backgroundColor: '#ffc7fd',   
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: -5,
    left: 0,
    right: 0,
  },
});


export default shooterStyles;
