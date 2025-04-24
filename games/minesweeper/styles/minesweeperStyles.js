import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  // Päärunko: täyttää koko näytön, keskittää sisällön ja antaa taustavärin
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgb(153, 255, 204)",
  },
  // Suuri otsikko sovelluksen yläreunaan
  title: {
    fontSize: 45,
    fontWeight: "bold",
    color: "rgb(63, 210, 136)",
    textShadowColor: "black",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    marginBottom: 40,
    fontFamily: "Bungee_400Regular",
  },
  // Ylätunnisteen säiliö asettaa vaikeus, aika ja miinat vierekkäin
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '95%',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: 5,
    marginBottom: 10,
  },
  // Jokainen elementti ylätunnisteessa (label + arvo)
  headerItem: {
    flexDirection: 'column',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  // Label-teksti ylätunnisteessa
  labelText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'rgb(63, 210, 136)',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textAlign: 'center',
    fontFamily: 'Bungee_400Regular',
  },
  // Arvoteksti ylätunnisteessa
  valueText: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'rgb(63, 210, 136)',
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    textAlign: 'center',
    marginTop: 4,
    fontFamily: 'Bungee_400Regular',
  },
  // Säiliö toimintonapeille vaakasuunnassa
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  // Yleinen nappityyli
  button: {
    backgroundColor: "rgb(63, 210, 136)",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  // Napin sisäisen tekstin tyyli
  buttonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Bungee_400Regular",
  },
  // Tuloksen näyttämisen nappi
  resultButton: {
    backgroundColor: "rgb(63, 210, 136)",
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  // Tulospainikkeen tekstin tyyli
  resultButtonText: {
    color: "#fff",
    fontSize: 12,
    fontFamily: "Bungee_400Regular",
  },
});

export default styles;
