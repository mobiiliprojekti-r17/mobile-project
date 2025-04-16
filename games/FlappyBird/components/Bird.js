import React from 'react';
import { Image } from 'react-native';

const Bird = (props) => {
  const birdWidth = 50;
  const birdHeight = 50;
  const x = props.body.position.x - birdWidth / 2;
  const y = props.body.position.y - birdHeight / 2;

  const velocityY = (props.body.velocity && props.body.velocity.y) || 0;
  

  let angle = velocityY * 3;
  if (angle > 30) angle = 30;
  if (angle < -30) angle = -30;

  return (
    <Image 
      source={require('../../../assets/FlappyNoBg.png')}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: birdWidth,
        height: birdHeight,
        transform: [{ rotate: `${angle}deg` }],
      }}
      resizeMode="contain"
    />
  );
};

export default Bird;
