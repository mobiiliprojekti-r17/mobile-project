// Tuodaan React ja React Native -komponentit sekä animaatio- ja dimensiotyökalut
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Image } from 'react-native';

// Haetaan näytön leveys animaatioiden alustamiseen
const { width } = Dimensions.get('screen');

// Pilvikuvat ja peruskoko skaalausta varten
const CLOUD_1 = require('../../../assets/Cloud1.png'); //Pilvien käyttämät kuvat assets kansiosta
const CLOUD_2 = require('../../../assets/Cloud2.png');
const BASE_W  = 80;   // Pilven perusleveys
const BASE_H  = 40;   // Pilven peruskorkeus

// Pilvien alkuparametrit: tunniste, pystysijainti, animaation kesto ja viive
const cloudData = [
  { id: 'cloud1', top:  80, duration: 30000, startDelay:    0 },
  { id: 'cloud2', top: 150, duration: 40000, startDelay: 5000 },
  { id: 'cloud3', top: 200, duration: 35000, startDelay: 3000 },
  { id: 'cloud4', top:  50, duration: 28000, startDelay: 2000 },
  { id: 'cloud5', top: 120, duration: 42000, startDelay: 7000 },
];

// Lisätään jokaiselle pilvelle kuva ja satunnainen skaala
cloudData.forEach((c, i) => {
  c.img   = i % 2 === 0 ? CLOUD_1 : CLOUD_2;        // Vuorottelee pilvikuvia: parillisilla indekseillä CLOUD_1, parittomilla CLOUD_2

  c.scale = 0.8 + Math.random() * 1.2;               // Skaalauksen vaihtelu 0.8–2.0 välillä
});

/**
 * CloudSprite-komponentti: renderöi single-pilvikuvan kuvana
 * @param {object} props.source - kuvatiedosto
 * @param {number} props.scale - skaalauskerroin
 */
const CloudSprite = ({ source, scale }) => (
  <Image
    source={source}
    style={{ width: BASE_W * scale, height: BASE_H * scale }}
    resizeMode="contain"
  />
);


// Sky-komponentti: taustaelementti, jossa auringon ja pilvien animaatio
 
export default function Sky() {
  // Luo Animated.Value -taulukon, joka sisältää kunkin pilven x-koordinaatin
  const cloudsAnim = useRef(
    cloudData.map(() => new Animated.Value(width + Math.random() * 100))
  ).current;

  useEffect(() => {
    /**
     * Käynnistää yksittäisen pilven animaation: liikuttaa oikealta vasemmalle
     * ja nollaa sijainnin, kun animaatio päättyy
     * @param {number} idx Pilven indeksi
     */
    const animate = (idx) => {
      const { duration, startDelay } = cloudData[idx];
      Animated.timing(cloudsAnim[idx], {
        toValue: -BASE_W,         // Liikutaan vasemmalle puolelle näytön "ulos"
        duration,
        delay: startDelay,
        useNativeDriver: false,   // position ei tue native driveria
      }).start(() => {
        // Kun animaatio päättyy, resetoi x-arvo ja käynnistä uudelleen
        const resetX = width + Math.random() * 100 + BASE_W;
        cloudsAnim[idx].setValue(resetX);
        animate(idx);
      });
    };

    // Aloita animaatiot kaikille pilville
    cloudData.forEach((_, i) => animate(i));

    // Cleanup: pysäytä animaatiot komponenteista poistuttaessa
    return () => cloudsAnim.forEach(a => a.stopAnimation());
  }, [cloudsAnim]);

  return (
    <View style={styles.container}>
      {/* Aurinko taustalla */}
      <View style={styles.sun} />

      {/* Renderöi jokaisen pilven Animated.Viewissä */}
      {cloudData.map((c, i) => (
        <Animated.View
          key={c.id}
          style={[
            styles.cloudContainer,
            { top: c.top, left: cloudsAnim[i] }, // pystysijainti ja animointi
          ]}
        >
          <CloudSprite source={c.img} scale={c.scale} />
        </Animated.View>
      ))}
    </View>
  );
}

// Tyylit komponentille
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: '#87CEEB', // Taustaväri
    zIndex: -1, // Varmistaa taustan alimman kerroksen
  },
  sun: {
    position: 'absolute',
    top: 50,
    right: 30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'yellow',
    shadowColor: 'yellow',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  cloudContainer: {
    position: 'absolute', // Pilvet säilyttää animaatiopaikan
  },
});