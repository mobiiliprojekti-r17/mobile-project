import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';

// Animoitu kiekko, joka simuloi sarakkeeseen pudotusta
const FlyingDisc = ({ color, toY, onEnd, cellSize, xOffset }) => {
  // Luodaan animaatioarvo Y-koordinaatille, aluksi juuri ruudukon yläpuolella
  const animY = useRef(new Animated.Value(-cellSize)).current;

  useEffect(() => {
    // Käynnistetään animaatio, joka liikuttaa kiekon Y-koordinaatista "toY":hen
    Animated.timing(animY, {
      toValue: toY,                  // mihin kohtaan lopuksi pysähtyy
      duration: 400,                 // kesto millisekunteina
      easing: Easing.out(Easing.quad), // pehmeä liike-efekti
      useNativeDriver: true,         // piirtää animaation natiiviohjaimella
    }).start(onEnd);                  // kutsuu onEnd callbackin animaation päätyttyä
  }, [toY]);

  return (
    // Animoitu näkymä edustaa pudotettavaa kiekkoa
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
