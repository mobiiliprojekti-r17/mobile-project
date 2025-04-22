import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

// Yksittäinen konfettipiste, joka nousee ja häipyy
const Confetti = ({ x, y, onComplete }) => {
  // Animoitu pystysuuntainen sijainti
  const translateY = useRef(new Animated.Value(0)).current;
  // Animoitu läpinäkyvyys
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Käynnistetään samaan aikaan nousu ja häipymisanimointi
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,      // liiku ylös 100 yksikköä
        duration: 1000,      // kesto 1 sekunti
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,          // pikselöidy täysin läpinäkyväksi
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start(() => {
      // Kutsutaan valinnainen callback, kun animointi on valmis
      onComplete?.();
    });
  }, []);

  return (
    <Animated.Text
      style={[
        styles.confetti,
        {
          top: y,              // vaakasijainti valintapropin mukaan
          left: x,             // pystysijainti valintapropin mukaan
          transform: [{ translateY }], // käytetään animoitua arvoa
          opacity,             // animoitu läpinäkyvyys
        }
      ]}
    >
      🎉{/* Konfetti  emoji */}
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  // Asetukset konfettitekstille
  confetti: {
    position: 'absolute',   // päällä muiden komponenttien
    fontSize: 24,           // sopivan kokoinen emoji
  },
});

export default Confetti;
