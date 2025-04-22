import { StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  // Pelin pääkontaineri: keskittää sisällön ja asettaa taustavärin
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor:'#B09AFF'
  },
  // Iso pelin otsikko ylhäällä
  title1: {
    fontSize: 70, 
    fontFamily: 'ConcertOne_400Regular',
    alignSelf: 'center',
    color: '#4A148C', 
  },
  //Leveli 
  title2: {
    fontSize: 40, 
    marginBottom: 20,
    fontFamily: 'ConcertOne_400Regular',
    alignSelf: 'center',
    color: '#4A148C', 
  },
  // Ajan ja siirtolaskurin asettelu vierekkäin
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginBottom: 5,
  },
  // Kehys, joka pitää aikatekstin ja siirtolaskurin yhdessä
  statsBox: {
    backgroundColor: "rgba(74, 20, 140, 0.25)",
    padding: 14,
    marginBottom: 20,
    alignItems: 'center',
    borderColor: "rgb(74, 20, 140)",
    borderWidth: 3,
    borderRadius: 10,
    width: '95%',
  },
  // Yksittäinen teksti ajalle ja siirroille
  statusText: {
    fontSize: 25,
    color: '#4A148C', 
    fontFamily: 'ConcertOne_400Regular',
    marginHorizontal: 30,
  },
  // Rivi pullojen asetteluun 
  bottleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
  // Pullojen kontin asettelu
  bottleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  // Yksittäisen pullon raamit ja koko suhteessa näytön leveyteen
  bottleWrapper: {
    width: width * 0.15,
    height: width * 0.15 * 2.3,
    margin: 1,
    position: 'relative',
    overflow: 'hidden',
    borderBottomLeftRadius: width * 0.15 * 0.27,   
    borderBottomRightRadius: width * 0.15 * 0.27,
  },
  // Pullon sisärakenne, jossa värit näkyvät
  bottleInner: {
    flex: 1,
    backgroundColor: '#B09AFF',
    borderBottomLeftRadius: width * 0.15 * 0.27,
    borderBottomRightRadius: width * 0.15 * 0.27,
    overflow: 'hidden',
  },
  // Pullon reunusvarjostus ja kehys
  bottleBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 1.5,
    borderColor: '#000',
    borderBottomLeftRadius: width * 0.15 * 0.26,
    borderBottomRightRadius: width * 0.15 * 0.26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  // Yksittäisen värikerroksen korkeus pullossa
  layer: {
    height: (width * 0.15 * 2.3) / 4,
    borderBottomWidth: 1,
    borderColor: '#aaa',
  },
  // Peittävä overlay aloitusruudulle
  overlay: {
    position: 'absolute',
    top: 0,
    left: -1,
    width: width,
    height: height,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  // Start-painike overlay-tilassa
  startButton: {
    backgroundColor: "rgb(74, 20, 140)",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 10
  },
  // Teksti start-napissa
  startButtonText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'ConcertOne_400Regular',
  },
  // Alanappien asettelukontaineri
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 10,
  },
  // Yksittäinen toimintonappi 
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A148C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  // Teksti toimintonapeissa
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
    fontFamily: 'ConcertOne_400Regular',
  },
});
