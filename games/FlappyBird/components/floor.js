// Tuodaan React ja React Native -komponentit sekä vakioarvot pelialueen mitoille
import React, { useRef } from 'react';
import { View } from 'react-native';
import { MAX_WIDTH, MAX_HEIGHT } from './constants';

// Määritellään lattiakomponentin korkeudet
const FLOOR_HEIGHT = 50;
const GRASS_HEIGHT = FLOOR_HEIGHT * 0.4;

// Värimääritykset maakerrokselle ja ruoholle
const SOIL_LIGHT  = '#8b5a37';
const SOIL_DARK   = '#5d3c22';
const SOIL_STRIPE = '#744b2c';
const GRASS_LIGHT = '#3dc35a';
const GRASS_DARK  = '#2a9b46';
const STONE_COLOR = '#998676';

/**
 * Stone-komponentti: renderöi pieniä kiviä lattiakerrokseen
 * @param {number} left X-koordinaatti kiven etäisyydelle vasemmalta
 * @param {number} size Kiven leveys (korkeus skaalaantuu)
 */
const Stone = ({ left, size }) => (
  <View
    style={{
      position: 'absolute',      // Asetetaan näytölle tarkkaan paikkaan
      bottom: 6,                 // Pieni noste lattiakerroksen sisällä
      left,                      // Vasen etäisyys propin mukaan
      width: size,               // Leveys propin mukaan
      height: size * 0.6,        // Korkeus verrattuna leveyteen
      backgroundColor: STONE_COLOR,
      borderRadius: size / 3,    // Pyöristys kiven muodon mukaan
      opacity: 0.5,              // Pieni läpinäkyvyys
    }}
  />
);

/**
 * GrassBlade-komponentti: renderöi yksittäisen ruohonsiiven
 * @param {number} left X-koordinaatti siiven etäisyydelle vasemmalta
 * @param {number} height Siiven korkeus
 */
const GrassBlade = ({ left, height }) => (
  <View
    style={{
      position: 'absolute',
      bottom: GRASS_HEIGHT - height,  // Sijoitetaan ruoho kerroksen sisälle
      left,                           // Vasen etäisyys propin mukaan
      width: 2,                       // Vakioviuhka leveys
      height,                         // Korkeus propin mukaan
      backgroundColor: GRASS_DARK,
      borderTopLeftRadius: 1,         // Pyöristetyt yläkulmat
      borderTopRightRadius: 1,
    }}
  />
);


// Floor-komponentti: sisältää maakerrokset, kivet ja ruohopeitteen
 
const Floor = () => {
  // Luodaan taakseen joustava kokoelma kiviä useRefin avulla
  const stones = useRef(
    Array.from({ length: 7 }).map((_, i) => {
      const size = 5 + Math.random() * 9;  // Satunnainen kiven koko
      const left = 8 + Math.random() * (MAX_WIDTH - 40);  // Satunnainen x-sijainti
      return <Stone key={`stone-${i}`} size={size} left={left} />;
    })
  ).current;

  // Luodaan ruohosiipivektori näkymälle
  const blades = useRef(
    Array.from({ length: Math.floor(MAX_WIDTH / 7) }).map((_, i) => {
      const left = i * 7 + Math.random() * 4;       // Ruohon x-offset
      const height = 5 + Math.random() * 7;         // Satunnainen korkeus
      return <GrassBlade key={`blade-${i}`} left={left} height={height} />;
    })
  ).current;

  return (
    <View
      style={{
        position: 'absolute',                  // Kiinteä sijoitus pelaajan näkymässä
        top: MAX_HEIGHT - FLOOR_HEIGHT,       // Alustetaan alareunaan asti
        left: 0,
        width: MAX_WIDTH,
        height: FLOOR_HEIGHT,
      }}
    >
      {/* Maakerros */}
      <View style={{ flex: 1, backgroundColor: SOIL_LIGHT }}>
        {/* Tummempi varjostus maakerroksen alaosassa */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: FLOOR_HEIGHT * 0.25,
            backgroundColor: SOIL_DARK,
            opacity: 0.35,
          }}
        />
        {/* Ohut raitakerros keskelle */}
        <View
          style={{
            position: 'absolute',
            top: FLOOR_HEIGHT * 0.45,
            left: 0,
            right: 0,
            height: FLOOR_HEIGHT * 0.08,
            backgroundColor: SOIL_STRIPE,
            opacity: 0.25,
          }}
        />
        {stones}  {/* Renderöidään kivet maakerroksen sisälle */}
      </View>

      {/* Ruohopeite kerroksen päällä */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: GRASS_HEIGHT,
          backgroundColor: GRASS_LIGHT,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          shadowColor: '#000',           // Varjostus ruoho-osioon
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.18,
          shadowRadius: 2,
        }}
      >
        {blades}  {/* Renderöidään ruoho */}
      </View>
    </View>
  );
};

export default Floor;