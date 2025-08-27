// Tuodaan React Native -tyylitiedostotyökalu ja dimenssiot
import { StyleSheet, Dimensions } from 'react-native';

// Haetaan näytön leveys ja korkeus suhteellisen mitoituksen vuoksi
const { width, height } = Dimensions.get('window');


  // Tulossivun tyylit:

const styles = StyleSheet.create({
  // Pääsäiliö, jossa sisennykset suhteessa näytön kokoon
  container: {
    flex: 1,
    backgroundColor: 'rgb(192, 253, 111)', // Taustaväri
    paddingHorizontal: width * 0.05,       // 5% sivureunukset
    paddingTop: height * 0.05,            // 5% yläreuna
    paddingBottom: height * 0.02,         // 2% alareuna
  },

  // Sivun otsikon tyyli, fontti ja koko suhteessa leveyteen
  title: {
    fontFamily: 'PressStart2P-Regular',   // Pikselifontti
    fontSize: width * 0.085,              // 8.5% näytön leveydestä
    textAlign: 'center',                  // Keskitetty teksti
    marginBottom: height * 0.02,          // 2% alapadding
    paddingTop: height * 0.05,            // 5% yläpadding
  },

  // Oman tuloksen esityslaatikko
  resultBox: {
    alignItems: 'center',                 // Keskittää sisällön
    marginBottom: height * 0.015,         // 1.5% alapadding
  },
  resultText: {
    fontSize: width * 0.07,               // 7% leveyssuunnassa
    fontFamily: 'VT323_400Regular',       // Fontti
    fontWeight: 'bold',
    marginBottom: 5,                      // Kiinteä alapadding
    padding: 0.1,                         // Pieni sisäpaddaus
  },

  // Top-listan otsikko
  topListTitle: {
    fontFamily: 'PressStart2P-Regular',
    fontSize: width * 0.05,               // 5% leveyssuunnassa
    textAlign: 'center',
    marginBottom: 11,
  },

  // Vieritettävän listan container
  scrollView: {
    flex: 1,
    marginBottom: 24,
  },

  // Yksittäisen tulosrivin tyyli
  resultItem: {
    width: width * 0.7,                   // 70% näytön leveydestä
    alignSelf: 'center',                  // Keskitetty
    marginBottom: 10,
    padding: 0.6,
    backgroundColor: 'rgba(160, 231, 68, 0.87)', // Taustaväri
    borderRadius: 5,
  },
  resultItemText: {
    fontSize: width * 0.061,              // 6.1% leveyssuunnassa
    fontFamily: 'VT323_400Regular',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  // Kotinapin tyyli tulossivulla
  homeButton: {
    backgroundColor: 'rgb(160, 231, 68)',
    paddingVertical: 13,
    paddingHorizontal: 22,
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 0.00001,                  // Pieni marginaali yläreunaan
    marginBottom: 20,
  },
  homeButtonText: {
    color: 'black',
    fontFamily: 'PressStart2P-Regular',
    fontSize: width * 0.038,               // 3.8% näytön leveydestä
  },
});

export default styles;