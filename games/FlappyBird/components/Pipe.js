import React from 'react';
import { View } from 'react-native';
import { MAX_HEIGHT } from './constants';

const Pipe = ({ body }) => {
  const width  = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x      = body.position.x - width  / 2;
  const y      = body.position.y - height / 2;

  const isTopPipe = y < MAX_HEIGHT / 2;

  const BASE   = '#4FD1D9';
  const BAND   = "lightgreen";
  const LIGHT  = '#7FE7EF';
  const SHADOW = '#257784';

  const CAP_H      = 24;
  const BAND_H     = 32;
  const boltSize   = 6;
  const boltOffset = 10;

  const bands = [];
  for (let i = 0; i < height; i += BAND_H) {
    bands.push(
      <View
        key={i}
        style={{
          position: 'absolute',
          top: i,
          left: 0,
          right: 0,
          height: BAND_H,
          backgroundColor: i / BAND_H % 2 === 0 ? BASE : BAND,
        }}
      />
    );
  }

  const Cap = () => (
    <View
      style={{
        position: 'absolute',
        left: -width * 0.15, 
        width:  width * 1.3,
        height: CAP_H,
        backgroundColor: BASE,
        borderTopLeftRadius     : isTopPipe ? 0  : 12,
        borderTopRightRadius    : isTopPipe ? 0  : 12,
        borderBottomLeftRadius  : isTopPipe ? 12 : 0,
        borderBottomRightRadius : isTopPipe ? 12 : 0,
        borderWidth: 2,
        borderColor: SHADOW,
 
        top: isTopPipe ? height - CAP_H : 0,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {['left', 'right'].map(side => (
        <View
          key={side}
          style={{
            position: 'absolute',
            top: CAP_H / 2 - boltSize / 2,
            [side]: boltOffset,
            width: boltSize,
            height: boltSize,
            borderRadius: boltSize / 2,
            backgroundColor: SHADOW,
            opacity: 0.6,
          }}
        />
      ))}
    </View>
  );

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top:  y,
        width,
        height,
        overflow: 'hidden',
      }}
    >
      {bands}

      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: width * 0.15,
          height: '100%',
          backgroundColor: SHADOW,
          opacity: 0.25,
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: width * 0.1,
          height: '100%',
          backgroundColor: LIGHT,
          opacity: 0.25,
        }}
      />

      <Cap />
    </View>
  );
};

export default Pipe;
