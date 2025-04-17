import { CurrentRenderContext } from '@react-navigation/native';
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
    marginTop: 60,
  },
  shineEffect: {
    position: 'absolute',
    top: '10%',
    left: '15%',
    width: 30,
    height: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    transform: [{ rotate: '-20deg' }], 
  },
  
  face: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#424040',
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 3,

    
  },
  shooterGameContainer: {
    backgroundColor: "rgb(255, 158, 226)",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    position: 'relative',
  },
  
  shooterScoreText: {
    fontSize: 27,
    color: '#6C5DD3',
    textShadowColor: '#8EA7E9',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    fontFamily: 'Kavoon_400Regular',
  },
  ShooterScreenContainer: {
    flex: 1,
    paddingBottom: 0,      
    overflow: 'hidden', 
  },
  shooterHomeIcon: {
    fontSize: 32,
    color: '#6C5DD3',
  },
  homeBox: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#76e3df',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    //borderWidth: 2,
    borderColor: '#6C5DD3',
    shadowColor: '#CBA8F5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  
  scoreBox: {
    position: 'absolute',
    top: 50,
    alignItems: 'center',
    backgroundColor: '#76e3df',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    //borderWidth: 2,
    borderColor: '#6C5DD3',
    shadowColor: '#CBA8F5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 100,
  },
  
});

export default shooterStyles;