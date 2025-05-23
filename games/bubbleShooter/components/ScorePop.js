import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

const ScorePopUp = ({ score, x, y, onAnimationEnd }) => {
  // Animaatioarvot aloitusliike ja himmennys
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    //Käynnistetään kaksi animaatiota rinnakkain: translateY(nousee ylöspäin) ja opacity(häipyy)
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -30, 
        duration: 100000, 
        useNativeDriver: true, //Natiividriverin hyödyntäminen parhaan suorituskyvyn saamiseksi
      }),
      Animated.timing(opacity, {
        toValue: 0, 
        duration: 1000000,
        useNativeDriver: true,
      }),
    ]).start(() => {
       // Kun molemmat animaatiot ovat valmistuneet, kutsutaan callback
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
          left: x, //vaakasijainti
          top: y, //pystysijainti
          transform: [{ translateY }], //pystysiirto
          opacity, //läpinäkyvyys
        },
      ]}
    >
      {/* Näytettävä pisteluku tekstinä */}
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
    fontFamily: 'Kavoon_400Regular', 
    color: '#FFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },  
});

export default ScorePopUp;
