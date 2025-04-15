// shooterStyles.js
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
    marginTop: 40,
  },
  face: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
  shooterGameContainer: {
    backgroundColor: "rgb(255, 158, 226)",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', 
    position: 'relative',
  },
  shooterScoreText: {
    fontSize: 30,
    color: '#6C5DD3',
    textShadowColor: '#8EA7E9',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    fontFamily: 'VT323_400Regular',
  },
  ShooterScreenContainer: {
    flex: 1,
    paddingBottom: 80,
    backgroundColor: 'rgb(255, 158, 226)',
    borderWidth: 10, 
    borderColor: "#6C5DD3",  
    borderRadius: 50,       
    overflow: 'hidden', 
  },
  shooterHomeIcon: {
    fontSize: 32,
    color: '#6C5DD3',
  },
  // Uusi container, johon laitetaan sekä score että home icon
  headerContainer: {
    position: 'absolute',
    top: 30,           // Etäisyys yläreunasta – säädä tarpeen mukaan
    left: '25%',
    right: '25%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#76e3df',  // Voit vaihtaa taustavärin mieleiseksesi
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#6C5DD3", 
    elevation: 4,              // Varjostus
    zIndex: 100,               // Näkyy muiden elementtien päällä
  },
});

export default shooterStyles;
