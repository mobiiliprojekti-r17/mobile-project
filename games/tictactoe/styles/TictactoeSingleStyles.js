import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  // Päärunko, keskittää sisällön ja antaa taustan
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgb(255, 216, 130)",
    padding: 20,
  },
  // Iso otsikkoteksti sivun yläosassa
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginTop: 15,
    color: '#3b2a3a',
    fontFamily: 'Audiowide_400Regular',
  },
  // Pienempi alaotsikko
  title2: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 10,
    color: '#3b2a3a',
    fontFamily: 'Audiowide_400Regular',
  },
  // Peliruudukon säiliö pystysuunnassa
  board: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Yhden vaakarivin asettelu
  row: {
    flexDirection: 'row',
  },
  // Yksittäisen ruudun ulkoasu reunuksineen ja varjostuksineen
  square: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fbc02d',
    backgroundColor: '#f9f2e7',
    margin: 5,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 5,
  },
  // Ruudun sisällä olevan merkin tyyli
  squareText: {
    fontSize: 65,
    fontWeight: 'bold',
    color: '#3b2a3a',
    fontFamily: 'Audiowide_400Regular',
  },
  // Teksti, joka kertoo kenen vuoro on
  turnText: {
    fontSize: 25,
    marginTop: 30,
    marginBottom: 10,
    color: '#3b2a3a',
    fontFamily: 'Audiowide_400Regular',
  },
  // Säiliö ohjauspainikkeille vaakasuunnassa
  buttonContainer: {
    flexDirection: 'row',
  },
  // Yksittäisen painikkeen ulkoasu
  button: {
    backgroundColor: '#fbc02d',
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  // Painikkeen tekstin tyyli
  buttonText: {
    color: '#fff',
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Audiowide_400Regular',
  },
  // Tausta modaalille
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
  // Sisältölaatikko modaalissa
  modalContent: {
    backgroundColor: "rgb(255, 216, 130)",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // Modaali-ikkunan tekstin tyyli
  modalText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "black",
    fontFamily: 'Audiowide_400Regular',
  },
  // Modaali-ikkunan sulkupainike
  modalButton: {
    backgroundColor: "#fbc02d",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  // Modaali-ikkunan napin teksti
  modalButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: 'Audiowide_400Regular',
  },
  // Vaikeustasovalinnan nappi
  levelButton: {
    backgroundColor: "#fbc02d",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    width: '100%',
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
  },
  // Vaikeustasovalinnan napin teksti
  levelButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: 'Audiowide_400Regular',
  },
});

export default styles;
