// AnimatedBall.js
import React, { useRef, useEffect } from 'react';
import { Animated, StyleSheet } from 'react-native';

const AnimatedBall = ({ x, y, size, color, onAnimationEnd }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
      if (onAnimationEnd) onAnimationEnd();
    });
  }, []);

  return (
    <Animated.View
      style={[
        styles.ball,
        {
          left: x - size,
          top: y - size,
          width: size * 2,
          height: size * 2,
          backgroundColor: color,
          borderRadius: size,
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
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
