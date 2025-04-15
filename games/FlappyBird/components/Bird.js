import React from 'react';
import { Image } from 'react-native';

  const Bird = (props) => {
  const width = props.body.bounds.max.x - props.body.bounds.min.x;
  const height = props.body.bounds.max.y - props.body.bounds.min.y;
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  return (
    <Image 
        source={require('../../../assets/FlappyBirdIcon.jpg')}
    style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
      }}
      resizeMode="contain"
    />
  );
};

export default Bird;