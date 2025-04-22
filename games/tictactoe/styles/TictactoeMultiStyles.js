import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
//koko näytön päärunko, keskittää sisällön ja lisää taustavärin
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgb(251, 151, 137)",
    padding: 20,
  },
  //iso otsikkoteksti sivun yläosaan
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#3b2a3a',
    fontFamily: 'Audiowide_400Regular',
  },
  //pienempi otsikko, käytetään alaotsikoihin
  title2: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: '#3b2a3a',
    fontFamily: 'Audiowide_400Regular',
  },
  // pelilauta, joka asettaa ruudukon pystysuuntaan keskitetysti
  board: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  //yksi laudan vaakarivi
  row: {
    flexDirection: 'row',
  },
  // yksittäinen peliruutu, reunuksineen ja varjostuksineen
  square: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    borderColor: "rgb(252, 109, 90)",
    backgroundColor: '#f9f2e7',
    margin: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  //  X tai O merkki ruudussa
  squareText: {
    fontSize: 65,
    fontWeight: 'bold',
    color: '#3b2a3a',
    fontFamily: 'Audiowide_400Regular',
  },
  //ilmoitus, kumpi pelaa seuraavaksi
  turnText: {
    fontSize: 25,
    marginTop: 30,
    marginBottom: 10,
    color: '#3b2a3a',
    fontFamily: 'Audiowide_400Regular',
  },
  // nappien vaakarivin kehys
  buttonContainer: {
    flexDirection: 'row',
  },
  // napit
  button: {
    backgroundColor: "rgb(252, 109, 90)",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  // nappien tekstit
  buttonText: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Audiowide_400Regular',
  },

  // läpinäkyvä tumma tausta modaalille
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    zIndex: 100,
  },
  // modaalin sisältö, vaaleanpunainen tausta ja varjostus
  modalContent: {
    backgroundColor: "rgb(251, 151, 137)",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  //teksti modaalissa
  modalText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "black",
    fontFamily: 'Audiowide_400Regular',
  },
  // modaalin napit
  modalButton: {
    backgroundColor: "rgb(252, 109, 90)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  // modaalin nappien teksti
  modalButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: 'Audiowide_400Regular',
  }
});

export default styles;
