import React from 'react';
import { View } from 'react-native';
import { MAX_WIDTH, MAX_HEIGHT } from './constants';

const FLOOR_HEIGHT = 50; 

const Floor = () => {
  return (
    <View
      style={{
        position: 'absolute',
        top: MAX_HEIGHT - FLOOR_HEIGHT,
        left: 0,
        width: MAX_WIDTH,
        height: FLOOR_HEIGHT,
        zIndex: 2,
      }}
    >
      <View style={{ flex: 1, backgroundColor: '#8B4513' }} />
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: FLOOR_HEIGHT * 0.3,
          backgroundColor: '#228B22',
        }}
      />
    </View>
  );
};

export default Floor;
