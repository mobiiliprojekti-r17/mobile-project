import React, { useRef } from 'react';
import { View } from 'react-native';
import { MAX_WIDTH, MAX_HEIGHT } from './constants';

const FLOOR_HEIGHT = 50;
const GRASS_HEIGHT = FLOOR_HEIGHT * 0.4;

const SOIL_LIGHT   = '#8b5a37';
const SOIL_DARK    = '#5d3c22';
const SOIL_STRIPE  = '#744b2c';
const GRASS_LIGHT  = '#3dc35a';
const GRASS_DARK   = '#2a9b46';
const STONE_COLOR  = '#998676';

const Stone = ({ left, size }) => (
  <View
    style={{
      position: 'absolute',
      bottom: 6,
      left,
      width:  size,
      height: size * 0.6,
      backgroundColor: STONE_COLOR,
      borderRadius: size / 3,
      opacity: 0.50,
    }}
  />
);

const GrassBlade = ({ left, height }) => (
  <View
    style={{
      position: 'absolute',
      bottom: GRASS_HEIGHT - height,
      left,
      width: 2,
      height,
      backgroundColor: GRASS_DARK,
      borderTopLeftRadius: 1,
      borderTopRightRadius: 1,
    }}
  />
);

const Floor = () => {
  const stones = useRef(
    Array.from({ length: 7 }).map((_, i) => {
      const size = 5 + Math.random() * 9;
      const left = 8 + Math.random() * (MAX_WIDTH - 40);
      return <Stone key={`stone-${i}`} size={size} left={left} />;
    })
  ).current;

  const blades = useRef(
    Array.from({ length: Math.floor(MAX_WIDTH / 7) }).map((_, i) => {
      const left   = i * 7 + Math.random() * 4;
      const height = 5 + Math.random() * 7;
      return <GrassBlade key={`blade-${i}`} left={left} height={height} />;
    })
  ).current;

  return (
    <View
      style={{
        position: 'absolute',
        top:   MAX_HEIGHT - FLOOR_HEIGHT,
        left:  0,
        width: MAX_WIDTH,
        height: FLOOR_HEIGHT,
      }}
    >
      <View style={{ flex: 1, backgroundColor: SOIL_LIGHT }}>
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left:   0,
            right:  0,
            height: FLOOR_HEIGHT * 0.25,
            backgroundColor: SOIL_DARK,
            opacity: 0.35,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: FLOOR_HEIGHT * 0.45,
            left: 0,
            right: 0,
            height: FLOOR_HEIGHT * 0.08,
            backgroundColor: SOIL_STRIPE,
            opacity: 0.25,
          }}
        />
        {stones}
      </View>

      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: GRASS_HEIGHT,
          backgroundColor: GRASS_LIGHT,
          borderBottomLeftRadius: 6,
          borderBottomRightRadius: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.18,
          shadowRadius: 2,
          elevation: 3,
        }}
      >
        {blades}
      </View>
    </View>
  );
};

export default Floor;
