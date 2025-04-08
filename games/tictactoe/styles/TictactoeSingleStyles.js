import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgb(255, 216, 130)", 
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginTop: 30,
    color: '#333', 
    textShadowColor: '#fff', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 3, 
  },
  title2: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: '#333', 
    textShadowColor: '#fff', 
    textShadowOffset: { width: 1, height: 1 }, 
    textShadowRadius: 3,  
  },
  board: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#d1a15b', 
    backgroundColor: '#f9f2e7', 
    margin: 10,
    borderRadius: 20, 
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5, 
  },
  squareText: {
    fontSize: 50,  
    fontWeight: 'bold',
    color: '#333',
  },
  turnText: {
    fontSize: 22,
    marginTop: 30,
    color: '#4c4c4c', 
  },
  button: {
    backgroundColor: '#fbc02d',
    width: 120,
    height: 45,
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3, 
  },
  
  buttonText: {
    color: '#fff', 
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export default styles;
