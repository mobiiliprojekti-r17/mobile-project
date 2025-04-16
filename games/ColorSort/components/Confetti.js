import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

const Confetti = ({ x, y, onComplete }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      })
    ]).start(() => {
      onComplete?.(); // poistetaan partikkeli animoituaan
    });
  }, []);

  return (
    <Animated.Text
      style={[
        styles.confetti,
        {
          top: y,
          left: x,
          transform: [{ translateY }],
          opacity
        }
      ]}
    >
      🎉
    </Animated.Text>
  );
};

const styles = StyleSheet.create({
  confetti: {
    position: 'absolute',
    fontSize: 24,
  },
});

export default Confetti;
