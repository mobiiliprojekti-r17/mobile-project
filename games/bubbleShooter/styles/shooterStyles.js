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
    fontSize: 30 ,
    color: '#FF70C0',
    marginBottom: 35,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    letterSpacing: 2,
    fontFamily: 'Kavoon_400Regular',
  },
  
  ShooterScreenContainer: {
    flex: 1,
    paddingBottom: 0,      
    overflow: 'hidden', 
  },
  shooterHomeIcon: {
    fontSize: 41,
    color: '#FF70C0',
    textShadowColor: '#ffffff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 15,
  },
  
  
  homeBox: {
    position: 'absolute',
    top: 50,
    left: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  
  scoreBox: {
    position: 'absolute',
    top: 54, 
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 14, 
    },

    arrowLine: {
      color: '#FF70C0',
      position: 'absolute',
      top: 45,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none', 
    },
    nextPreview: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: '#fff',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
      elevation: 4,
    },
    
});


export default shooterStyles;