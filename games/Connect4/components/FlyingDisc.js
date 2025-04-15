import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

const FlyingDisc = ({ color, toY, onEnd, cellSize, xOffset }) => {
  const animY = useRef(new Animated.Value(-cellSize)).current;

  useEffect(() => {
    Animated.timing(animY, {
      toValue: toY,
      duration: 400,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start(onEnd);
  }, [toY]);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        width: cellSize,
        height: cellSize,
        borderRadius: cellSize / 2,
        backgroundColor: color,
        left: xOffset,
        zIndex: 10,
        transform: [{ translateY: animY }],
        opacity: animY.interpolate({
          inputRange: [-cellSize, toY / 2, toY],
          outputRange: [0.3, 0.9, 1],
          extrapolate: 'clamp',
        }),
      }}
    />
  );
};

export default FlyingDisc;
