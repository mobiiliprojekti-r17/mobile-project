import { Dimensions, StyleSheet } from 'react-native';
 
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  // Päätason runko, keskittää sisällön ja antaa taustavärin
  container: {
    flex: 1,
    backgroundColor: "rgb(160, 220, 255)", 
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  // Pääotsikon tyyli
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color:  "#2162aa",
    marginBottom: 20,
    marginTop: 60,
    fontFamily: 'RobotoMono_400Regular',
  },  
  // Alaotsikon tyyli
  title2: {
    fontSize: 28,
    fontWeight: "bold",
    color:  "#2162aa", 
    marginBottom: 10,
    marginTop: 10,
    fontFamily: 'RobotoMono_400Regular',
  },
  // Tuloksen tietolaatikon ulkoasu
  resultBox: {
    backgroundColor: "rgb(188, 231, 255)", 
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "90%",
    alignItems: "center",
    borderColor: "rgb(127, 203, 244)",
    borderWidth: 3,
  },
  // Yleistekstin tyyli tuloslaatikossa
  infoText: {
    fontSize: 18,
    color: "#333", 
    marginBottom: 5,
    fontFamily: 'RobotoMono_400Regular',
  },
  // Alaotsikon tyyli tulosnäkymässä
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2162aa", 
    marginBottom: 10,
    fontFamily: 'RobotoMono_400Regular',
  },
  // Vieritettävän listan leveys
  scrollView: {
    width: "95%",
  },
  // Yhden tulosrivielementin laatikko
  scoreItem: {
    backgroundColor: "rgb(205, 235, 252)", 
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor: "rgb(127, 203, 244)",
    borderWidth: 3,
  },
  // Tulosrivillä käytettävä teksti
  scoreText: {
    fontSize: 16,
    color: "#333", 
    marginBottom: 2,
    fontFamily: 'RobotoMono_400Regular',
  },
  // Viesti, kun ei ole tuloksia
  noScores: {
    fontSize: 16,
    color: "#555", 
    textAlign: "center",
    marginTop: 10,
    fontFamily: 'RobotoMono_400Regular',
  },
  // Painikerivin säiliö
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around", 
    alignItems: "center",
    marginVertical: 5,
  },
  // Säiliö listan tuloskohteille
  scoresContainer: {
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: "rgb(188, 231, 255)", 
    padding: 10,
    borderRadius: 8,
    borderColor: "rgb(154, 218, 252)",
    borderWidth: 3,
  },
  // Vaikeustason otsikon tyyli
  difficultyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2162aa",
    marginBottom: 5,
    fontFamily: 'RobotoMono_400Regular',
  },
  // Yleinen picker-komponentin tyyli
  picker: {
    width: "80%",
    height: 50,
    backgroundColor: "white",
    color: "#333",
    marginBottom: 15,
    borderRadius: 5,
  },
  // Painike-säiliö suodattimille
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  // Yleinen suodatinpainikkeen tyyli
  filterButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "rgb(188, 231, 255)",
    borderRadius: 10,
    borderColor: "rgb(127, 203, 244)",
    borderWidth: 3,
  },
  // Valitun suodatuspainikkeen korostus
  selectedButton: {
    backgroundColor: "rgb(127, 203, 244)",
  },
  // Painiken tekstin tyyli
  buttonText: {
    color: "#000", 
    fontWeight: "bold",
    fontFamily: 'RobotoMono_400Regular',
  },
  // Sijoitusnumeron tyyli
  rank: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2162aa", 
    marginBottom: 5,
  },
  // Kotinapin ulkoasu
  Homebutton: {
    backgroundColor: "rgb(188, 231, 255)", 
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
    borderColor: "rgb(127, 203, 244)",
    borderWidth: 3,
    flexDirection: 'row', 
  },
  // Kotinapin tekstin tyyli
  HomebuttonText: {
    color: '#fff', 
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'RobotoMono_400Regular',
  },
  // Pelin uudelleenaloitusnappin tyyli
  PlayAgainButton: {
    backgroundColor: "rgb(188, 231, 255)", 
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
    borderColor: "rgb(127, 203, 244)",
    borderWidth: 3,
    flexDirection: 'row', 
  },
  // Uudelleenaloitusnapin tekstin tyyli
  PlayAgainButtonText: {
    color: '#fff', 
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'RobotoMono_400Regular',
  },
  // Modalin taustakerros
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  // Modal-sisältölaatikon tyyli
  modalView: {
    margin: 20,
    backgroundColor: "rgb(160, 220, 255)",
    padding: width * 0.05,
    borderRadius: 12,
    alignItems: "stretch",
    width: width * 0.7,
    elevation: 5,
  },
  // Yleinen modal-painike
  button: {
    backgroundColor: "rgb(33, 131, 184)",
    paddingVertical: height * 0.01,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: height * 0.007,
  },
  // Modal-sulkemispainike (sama väri)
  buttonClose: {
    backgroundColor: "rgb(33, 131, 184)",
  },
  // Modalin tekstin tyyli
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
});

export default styles;
