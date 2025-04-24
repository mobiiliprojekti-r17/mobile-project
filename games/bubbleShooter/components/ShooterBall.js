import React, { memo } from 'react';
import { View, Text } from 'react-native';
import shooterStyles from '../styles/shooterStyles';

//Piirretään pallo
const Ball = ({ x, y, size, color }) => {
  return (
    //Määritellään asema ja koko props arvojen avulla
    <View
      style={[
        shooterStyles.shooterBall,
        {
          left: x - size / 2,
          top: y - size / 2,
          width: size,
          height: size,
          backgroundColor: color,
        },
      ]}
    >
      {/* Kiiltoefekti */}
      <View
        style={[
          shooterStyles.shineEffect,
          {
            width: size * 0.4,
            height: size * 0.4,
            borderRadius: size * 0.2,
          },
        ]}
      />
      {/* Hymiö */}
      <Text style={shooterStyles.face}>{'₍꒢  ̣̮꒢₎'}</Text>
    </View>
  );
};

// Rerenderöidään vaan jos X, Y, koko tai väri muuttuvat
export default memo(
  Ball,
  (prev, next) =>
    prev.x === next.x &&
    prev.y === next.y &&
    prev.size === next.size &&
    prev.color === next.color
);
