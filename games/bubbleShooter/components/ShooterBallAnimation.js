// AnimatedBall.js
import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';

const AnimatedBall = ({ x, y, size, color, onAnimationEnd }) => {
  // Skaalan ja läpinäkyvyyden animointi
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Käynnistetään kaksi animaatiota samanaikaisesti(skaalataan ja himmennetään)
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.5,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      //Kun animaatio päättyy (esim. poistetaan pallo näytöltä) kutsutaan callback-funktio
      if (onAnimationEnd) onAnimationEnd();
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.ball,
        {
          // Asetetaan pallon koko ja sijainti
          left: x - size,
          top: y - size,
          width: size * 2,
          height: size * 2,
          backgroundColor: color,
          borderRadius: size,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
          // Visuaaliset efektit
          shadowColor: '#fff',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.9,
          shadowRadius: 10,
          elevation: 10,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  ball: {
    position: 'absolute',
  },
});

export default AnimatedBall;
