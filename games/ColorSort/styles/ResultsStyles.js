import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  // Yleinen taustaväri ja reunojen täyttö kaikille näkymille
  container: {
    flex: 1,
    backgroundColor: '#B09AFF',   
    padding: 20,
  },
  // Päänäytön otsikko: suuri, lihavoitu ja teemavärinen
  title: {
    fontSize: 40,
    fontWeight: '800',
    color: '#4A148C',           
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 20,
    fontFamily: 'ConcertOne_400Regular',
  },
  // Kehys oman tuloksen esillepanolle
  resultBox: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignSelf: 'center',
    width: '60%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderColor: 'rgb(74, 20, 140)',
    borderWidth: 3,
  },
  // Teksti oman tuloksen riveillä
  resultText: {
    fontSize: 22,
    color: '#4A148C',
    textAlign: 'left',  
    fontFamily: 'ConcertOne_400Regular',
  },
  // Viesti, kun tuloksia ei ole vielä
  NoresultText: {
    fontSize: 25,
    color: '#4A148C',
    textAlign: 'center',  
    fontFamily: 'ConcertOne_400Regular',
  },
  // Otsikko Top 10 -listalle
  topListTitle: {
    fontSize: 30,
    color: '#4A148C',
    alignSelf: 'center',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'ConcertOne_400Regular',
  },
  // Kehys Top 10 -listan kokoelmalle
  TopresultBox: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    alignSelf: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    borderColor: 'rgb(74, 20, 140)',
    borderWidth: 3,
    flex: 1,
  },
  // ScrollView:n leveys täyteen laatikkoon
  scrollView: {
    width: '100%',
  },
  // Yhden tulosrivinsä esitystyyli
  resultItem: {
    backgroundColor: '#B09AFF',
    padding: 10,
    borderRadius: 12,
    marginBottom: 5,
    alignSelf: 'center',
    width: '100%',
    borderColor: 'rgb(74, 20, 140)',
    borderWidth: 3,
  },
  // Sijoitustekstin tyyli tulosrivillä
  rank: {
    fontSize: 30,
    fontWeight: '700',
    color: '#4A148C',
    marginBottom: 2,
    fontFamily: 'ConcertOne_400Regular',
  },
  // Muut tulosrivillä näkyvät tiedot
  resultItemText: {
    fontSize: 18,
    color: '#4A148C',
    marginVertical: 2,
    fontFamily: 'ConcertOne_400Regular',
  },
  // Nappien kehys
  ButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
    marginBottom: 20,
  },
  // Koti-nappi
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A148C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  // Teksti koti-napissa
  homeButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'ConcertOne_400Regular',
  },
  // Pelaa uudelleen -nappi
  PlayAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A148C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  // Teksti pelaa uudelleen -napissa
  PlayAgainButtonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'ConcertOne_400Regular',
  },
});
