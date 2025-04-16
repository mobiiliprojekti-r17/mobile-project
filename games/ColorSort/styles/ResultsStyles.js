
import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B09AFF',  // Pääväri, sama kuin muissa näytöissä
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  resultBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  resultText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
  },
  topListTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  scrollView: {
    width: '100%',
    marginBottom: 20,
  },
  resultItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultItemText: {
    fontSize: 18,
    color: '#333',
  },
  homeButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 20,
  },
  homeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#B09AFF',
  },
});
