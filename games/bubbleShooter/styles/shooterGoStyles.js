import { StyleSheet } from 'react-native';

const shooterGoStyles = StyleSheet.create({
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  gameOverTitle: {
    fontSize: 45,
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

  gameOverText: {
    fontSize: 20,
    color: '#6C5DD3',
    marginBottom: 6,
    textAlign: 'center',
    textShadowColor: '#CBA8F5',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Kavoon_400Regular',
  },

  gameOverScore: {
    fontSize: 20,
    color: '#6C5DD3',
    marginBottom: 6,
    textAlign: 'center',
    textShadowColor: '#CBA8F5',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Kavoon_400Regular',
  },

  gameOverRank: {
    fontSize: 22,
    color: '#6C5DD3',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: '#CBA8F5',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Kavoon_400Regular',
  },

  gameOverButtonContainer: {
    marginVertical: 10,
    width: 220,
    backgroundColor: '#FF9EE2',
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#CBA8F5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 4,
  },

  gameOverButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'FredokaOne_400Regular',
  },

  topListTitle: {
    fontSize: 24,
    marginTop: 30,
    color: '#6C5DD3',
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: '#CBA8F5',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Kavoon_400Regular',
  },

  topListContainer: {
    marginTop: 10,
    width: '90%',
    maxHeight: 265,
    
  },

  topListItem: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 24,
    marginVertical: 8,
    shadowColor: '#D9BFFF',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FF9EE2',
  },

  topListName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6C5DD3',
    fontFamily: 'FredokaOne_400Regular',
  },

  topListScore: {
    fontSize: 16,
    color: '#FF9EE2',
    fontFamily: 'FredokaOne_400Regular',
  },

  glowEffect: {
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },

  sparkleEmoji: {
    position: 'absolute',
    fontSize: 28,
  },
});

export default shooterGoStyles;
