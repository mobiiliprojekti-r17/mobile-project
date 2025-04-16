import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

const ScorePopUp = ({ score, x, y, onAnimationEnd }) => {
  // Animaatioarvot: aloitusliike ja himmennys
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -30, // liikutetaan 30 pikseliä ylöspäin
        duration: 60000, // animaation kesto millisekunteina
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0, // opacity häivyy nollaan
        duration: 800000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Kun animaatio on valmis, kutsutaan callback-toimintoa, jotta komponentti voidaan poistaa
      if (onAnimationEnd) {
        onAnimationEnd();
      }
    });
  }, [translateY, opacity, onAnimationEnd]);

  return (
    <Animated.View
      style={[
        styles.popUp,
        {
          left: x, // x-koordinaatti, mistä popup tulee
          top: y,  // y-koordinaatti, mistä popup tulee
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <Text style={styles.text}>+{score}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  popUp: {
    position: 'absolute',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: 'Kavoon_400Regular', // <-- tämä lisättiin
    color: '',
  },
});

export default ScorePopUp;
