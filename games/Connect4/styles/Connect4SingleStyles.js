import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  // Pääkontaineri keskittää kaiken ja antaa taustan
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "rgb(255, 246, 143)", 
  },
  // Suuri pääotsikko pelin nimelle
  title: {
    fontSize: 65,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
    color: '#3b2a3a', 
    fontFamily: 'FredokaOne_400Regular',
  },
  // Alaotsikko
  title2: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 50,
    color: '#3b2a3a', 
    fontFamily: 'FredokaOne_400Regular',
  },
  // Tekstinäytössä kerrotaan vuorossaolija ja pelin päätyttyä lopputulos
  player: {
    fontSize: 25,
    marginBottom: 10,
    fontFamily: 'FredokaOne_400Regular',
  },
  // Laudan ulkonäkö: keltainen tausta ja pyöristetyt kulmat
  board: {
    backgroundColor: "rgb(255, 204, 0)", 
    padding: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  // Rivin säiliö järjestää solut vaakasuunnassa
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  // Yksi solu, jonka sisälle kiekko putoaa
  cell: {
    width: 40,
    height: 40,
    backgroundColor: "rgb(255, 246, 143)", // sama kuin tausta
    borderRadius: 25,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Kiekon ulkoasu
  disc: {
    width: 40,
    height: 40,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  // Säiliö nappeja vaakasuunnassa varten
  buttonContainer: {
    flexDirection: 'row',
  },
  // Yleinen nappityyli 
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "rgb(255, 204, 0)", 
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center', 
    marginHorizontal: 8, 
  },
  // Napin tekstin tyyli
  buttonText: {
    color: 'white', 
    fontSize: 20,
    fontFamily: 'FredokaOne_400Regular',
  },
});
