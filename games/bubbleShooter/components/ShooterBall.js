import React from 'react';
import { View, Text } from 'react-native';
import shooterStyles from '../styles/shooterStyles';

const Ball = ({ x, y, size, color }) => {
  return (
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
      <Text style={shooterStyles.face}>{'₍꒢  ̣̮꒢₎'}</Text>
    </View>
  );
};

export default Ball;
