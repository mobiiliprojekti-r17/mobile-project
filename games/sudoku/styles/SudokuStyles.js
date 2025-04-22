import { Dimensions, StyleSheet } from 'react-native';
 
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  // Päätason runko, joka keskittää kaikki elementit ja antaa taustan
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(160, 220, 255)",
    padding: 10,
  },
  // Sovelluksen pääotsikko
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2162aa",
    fontFamily: 'RobotoMono_400Regular',
  },
  // Ylätunniste, jossa vaikeustaso ja kellonaika
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "105%",
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  // Teksti vaikeustason näyttöön
  difficultyText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#2162aa",
    fontFamily: 'RobotoMono_400Regular',
  },
  // Teksti ajastimen näyttöön
  timerText: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#2162aa",
    fontFamily: 'RobotoMono_400Regular',
  },
  // Rivi sudokulaudalle
  row: {
    flexDirection: "row",
  },
  // Esitäytetyn solun tekstin tyyli
  preFilledCellText: {
    color: "black", 
    fontWeight: 'bold'
  },
  // Käyttäjän lisäämän numeron tekstin väri
  userAddedNumberText: {
    color: "blue", 
  },
  // Yksittäisen solun ulkonäkö
  cell: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1, 
    borderColor: "black",
    backgroundColor: "white", 
  },
  // Paksu yläreuna 3×3-lohkon alussa
  boldTop: { borderTopWidth: 3 },
  // Paksu vasen reuna lohkon alussa
  boldLeft: { borderLeftWidth: 3 },
  // Paksu oikea reuna viimeisessä sarakkeessa
  boldRight: { borderRightWidth: 3 },
  // Paksu alareuna viimeisellä rivillä
  boldBottom: { borderBottomWidth: 3 },
  // Taustaväri eri värisille 3×3-lohkoille
  blueCell: { backgroundColor: "rgb(188, 231, 255)" },
  // Korostus valitulle solulle
  selectedCell: {
    backgroundColor: "rgb(127, 203, 244)",
  },
  // Solun sisällön tekstin tyyli
  cellText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  // Paksut reunat 3×3-lohkon ympärille
  largeBoxBorder: {
    borderColor: "black",
    borderWidth: 2,
  },
  // Keskimmäisen lohkon paksu reunus 
  centerBoxBorder: {
    borderColor: "black",
    borderWidth: 2,
  },
  // Koko numeropadin container
  numberPad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  // Yksi numeronappi
  numberButton: {
    width: 70,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(188, 231, 255)",
    margin: 2,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
    marginLeft: 5,
    marginRight: 5,
  },
  // Numeronapin tekstin tyyli
  numberButtonText: {
    color: "black",
  },
  // Numeronappi kun se on pois käytöstä
  numberButtonDisabled: {
    backgroundColor: '#ccc',
    borderColor: '#888',
  },
  // Numeropadin ulkokehys
  numberPadBox: {
    backgroundColor: '#fff',
    borderRadius: 20,
    flexDirection: 'column',  
    alignItems: 'center',
    marginVertical: 10,
    width: "70%",
  },
  // Tyhjennä-painike solussa
  clearButton: {
    width: 70,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(188, 231, 255)",
    margin: 5,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
  },
  // Tarkista-painike sudokun validointiin
  CheckButton: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(188, 231, 255)",
    margin: 5,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
  },
  // Tarkista-painikkeen tekstityyli
  CheckButtonText: {
    color: "black", 
    fontSize: 16, 
    fontFamily: 'RobotoMono_400Regular',
  },
  // Info-painike ohjeiden näyttöön
  InfoButton: {
    width: 70,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(188, 231, 255)",
    margin: 5,
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
  },
  // Napin tyyli muistiinpanotilalle
  ModeButton: {
    minWidth: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgb(188, 231, 255)",
    margin: 5,
    borderRadius: 5,
    borderColor: "#000",
    borderWidth: 2,
  },
  // ModeButtonin tekstin tyyli
  ModeButtonText: {
    color: "black", 
    fontSize: 16, 
    fontFamily: 'RobotoMono_400Regular',
  },
  // Aktiivinen muistiinpanotila
  ModeButtonActive: {
    backgroundColor: "rgb(33, 131, 184)",
  },
  // Aktiivisen tilan tekstin tyyli
  ModeButtonTextActive: {
    color: "white", 
    fontFamily: 'RobotoMono_400Regular',
    fontSize: 16, 
  },
  // Virheellisen solun korostus
  cellError: {
    backgroundColor: "rgb(33, 131, 184)",
  },
  // Kontti Home/Restart-painikkeille
  ButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  // Home-painikkeen ulkoasu
  Homebutton: {
    backgroundColor: "rgb(33, 131, 184)",
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
  },
  // Home-painikkeen tekstin tyyli
  HomebuttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'RobotoMono_400Regular',
  },
  // Restart-painikkeen tyyli
  Restartbutton: {
    backgroundColor: "rgb(33, 131, 184)",
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
  },
  // Restart-painikkeen tekstin tyyli
  RestartbuttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'RobotoMono_400Regular',
  },
  // Muistiinpanosolujen container
  notesContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // Muistiinpanorivin asettelu
  notesRow: {
    flex: 1,
    flexDirection: 'row',
  },
  // Muistiinpanotekstin tyyli
  noteText: {
    flex: 1,
    fontSize: 10,
    textAlign: 'center',
    lineHeight: 12,
  },
  // Piilotettu muistiinpanoteksti
  noteHiddenText: {
    color: 'transparent',
  },
  // Modalin tumma overlay
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  // Modalin varsinainen sisältölokero
  modalView: {
    margin: 20,
    backgroundColor: "rgb(160, 220, 255)",
    padding: width * 0.05,
    borderRadius: 12,
    alignItems: "stretch",
    width: width * 0.7,
    elevation: 5,
  },
  // Modalin painike
  button: {
    backgroundColor: "rgb(33, 131, 184)",
    paddingVertical: height * 0.01,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.007,
  },
  // Modalin sulkupainikkeen lisätyyli
  buttonClose: {
    backgroundColor: "rgb(33, 131, 184)",
  },
  // Modalin teksti
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'RobotoMono_400Regular',
  },
  // Modalin otsikkotekstin tyyli
  modalText: {
    fontSize: width * 0.055,
    fontWeight: "bold",
    marginBottom: height * 0.02,
    textAlign: "center",
    color: "rgb(33, 131, 184)",
    fontFamily: 'RobotoMono_400Regular',
  },
  // Info-osion kontti modalissa
  InfoContainer: { 
    alignItems: 'flex-start', 
    backgroundColor: 'rgb(33,131,184)',
    borderRadius: 8,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.015, 
    marginBottom: height * 0.015,
  },
  // Modalin info-otsikon teksti
  ModalInfoText:{
    textAlign: "center",
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'RobotoMono_400Regular',
    marginRight: width * 0.02, 
  },
  // Modalin info-kuvauksen teksti
  ModalInfo2Text:{
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'RobotoMono_400Regular',
    marginRight: width * 0.02, 
  },
});

export default styles;
