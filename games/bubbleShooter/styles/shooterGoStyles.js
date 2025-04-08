import { StyleSheet } from 'react-native';

const shooterGoStyles = StyleSheet.create({
  gameOverContainer: {
    flex: 1,
    backgroundColor: '#ffc7fd',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  gameOverTitle: {
    fontSize: 40,
    color: '#FF9EE2',
    marginBottom: 40,
    fontWeight: 'bold',
    textShadowColor: '#6C5DD3',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
    textAlign: 'center',
    fontFamily: 'ChangaOne_400Regular',
  },
  gameOverScore: {
    color: '#6C5DD3', 
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    fontFamily: 'ChangaOne_400Regular',
  },
  gameOverText: {
    fontSize: 18,
    color: '#6C5DD3',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'ChangaOne_400Regular',
  },
  gameOverButtonContainer: {
    marginVertical: 10,
    width: 200,
    backgroundColor: '#FF9EE2', 
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#6C5DD3', 
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    
    
  },
  topListTitle: {
    fontSize: 22,
    marginTop: 30,
    color: '#6C5DD3',
    fontWeight: 'bold',
    textShadowColor: '#FFF',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'ChangaOne_400Regular',
  },
  topListContainer: {
    marginTop: 10,
    width: '90%',
    maxHeight: 200,
    
  },
  topListItem: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    shadowColor: '#A0DCFF',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: 'center',
    
  },
  topListName: {
    fontWeight: 'bold',
    color: '#6C5DD3',
    fontFamily: 'ChangaOne_400Regular',
  },
  topListScore: {
    color: '#FF9EE2',
    fontFamily: 'ChangaOne_400Regular',
  },
});

export default shooterGoStyles;
