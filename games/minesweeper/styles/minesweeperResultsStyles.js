import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Päärunko: täyttää koko näytön, keskittää sisällön ja asettaa taustan
  container: {
    flex: 1,
    backgroundColor: "rgb(153, 255, 204)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  // Päänäytön otsikko: suuri, lihavoitu ja värikäs fontti
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: "rgb(4, 201, 103)",
    marginBottom: 10,
    marginTop: 60,
    fontFamily: "Bungee_400Regular",
  },
  // Alaotsikko: hieman pienempi kuin pääotsikko
  title2: {
    fontSize: 30,
    fontWeight: "bold",
    color: "rgb(4, 201, 103)",
    marginBottom: 5,
    marginTop: 20,
    fontFamily: "Bungee_400Regular",
  },
  // Ruudukon tuloksen laatikko: eli oma tulososio
  resultBox: {
    backgroundColor: "rgb(119, 250, 185)",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
    borderColor: "rgb(0, 105, 53)",
    borderWidth: 3,
  },
  // Teksti oman tuloksen tiedoille (nimi, aika, sijoitus)
  infoText: {
    fontSize: 20,
    color: "rgb(0, 105, 53)",
    marginBottom: 5,
    fontFamily: "Bungee_400Regular",
    alignSelf: "flex-start",
  },
  // Vieritettävän listan leveys
  scrollView: {
    width: "90%",
  },
  // Yhden tulosrivin laatikko top-listassa
  scoreItem: {
    backgroundColor: "rgb(119, 250, 185)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderColor: "rgb(0, 105, 53)",
    borderWidth: 2,
  },
  // Teksti tulosrivin sisällä: nickname ja aika
  scoreText: {
    fontSize: 18,
    color: "rgb(0, 105, 53)",
    marginBottom: 2,
    fontFamily: "Bungee_400Regular",
  },
  // Ilmoitus, kun top-listassa ei ole vielä tuloksia
  noScores: {
    fontSize: 20,
    color: "rgb(0, 105, 53)",
    textAlign: "center",
    marginTop: 10,
    fontFamily: "Bungee_400Regular",
  },
  // Sektion tausta kullekin vaikeustasolle (EASY, MEDIUM, HARD)
  difficultySection: {
    marginBottom: 15,
    backgroundColor: "rgb(76, 252, 164)",
    padding: 10,
    borderRadius: 8,
    borderColor: "rgb(0, 105, 53)",
    borderWidth: 3,
  },
  // Sektion otsikko: vaikeustason nimi
  difficultyTitle: {
    fontSize: 25,
    fontWeight: "bold",
    color: "rgb(0, 105, 53)",
    marginBottom: 5,
    fontFamily: "Bungee_400Regular",
  },
  // Dropdown-tyylisen pickerin leveys ja ulkoasu
  picker: {
    width: "80%",
    height: 50,
    backgroundColor: "white",
    color: "#333",
    marginBottom: 15,
    borderRadius: 5,
  },
  // Säiliö helpottaa nappien vaakajärjestystä
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  // Suodatusnappi vaikeustason valintaan
  filterButton: {
    padding: 10,
    marginHorizontal: 5,
    backgroundColor: "rgb(76, 252, 164)",
    borderRadius: 5,
  },
  // Korostettu suodatusnappi, jos valittuna
  selectedButton: {
    backgroundColor: "rgb(71, 224, 148)",
  },
  // Teksti nappien päällä
  buttonText: {
    color: "rgb(0, 105, 53)",
    fontWeight: "bold",
    fontFamily: "Bungee_400Regular",
    fontSize: 15,
  },
  // Numerosijoitus rivin vasemmassa reunassa
  rank: {
    fontSize: 30,
    fontWeight: "bold",
    color: "rgb(0, 105, 53)",
    marginBottom: 5,
    fontFamily: "Bungee_400Regular",
  },
  // Toimintonappien säiliö (Play Again / Home)
  resultButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 5,
  },
  // Yleinen nappityyli napeille
  Button: {
    backgroundColor: "rgb(76, 252, 164)",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Tekstityyli näille napeille
  ButtonText: {
    color: "rgb(0, 105, 53)",
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: "Bungee_400Regular",
  }
});

export default styles;
