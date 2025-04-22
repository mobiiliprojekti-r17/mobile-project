import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

const ExplosionEmoji = ({ size = 32, onComplete }) => {
  // Luo muuttujat animoitaville arvoille
  const scale = useRef(new Animated.Value(0.5)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Käynnistää samanaikaisesti animaatiot
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1.8, 
        duration: 400,           // animaation kesto millisekunteina
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0, 
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onComplete) onComplete();
    });
  }, []);

  return (
    <Animated.Text
      style={[ // animaation tyylit
        styles.emoji, 
        {
          fontSize: size, 
          transform: [{ scale }],
          opacity, 
        },
      ]}
    >
      💥
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  emoji: {
    position: 'absolute',      // päällekkäin muu sisältö
    zIndex: 10,                // ettei jää muiden elementtien taakse
  },
});

export default ExplosionEmoji;
