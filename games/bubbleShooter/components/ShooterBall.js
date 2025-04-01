import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Ball = ({ x, y, size, color }) => {
  return (
    <View style={[styles.ball, { left: x - size / 2, top: y - size / 2, width: size, height: size, backgroundColor: color }]}>
      <Text style={styles.face}>{'₍꒢  ̣̮꒢₎'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  ball: {
    position: 'absolute',
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.7,
    shadowRadius: 2,
    elevation: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  face: {
    fontSize: 15,  // Tekstin koko
    color: 'white', // Tekstin väri
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Ball;
