import React from 'react';
import { View, StyleSheet } from 'react-native';

//Luodaan pallot, joita ammutaan
const Ball = ({ x, y, size, color }) => {
  return (
    <View style={[styles.ball, { left: x - size / 2, top: y - size / 2, width: size, height: size, backgroundColor: color }]} />
  );
};

const styles = StyleSheet.create({
  ball: {
    position: 'absolute',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,

  },
});

export default Ball;
