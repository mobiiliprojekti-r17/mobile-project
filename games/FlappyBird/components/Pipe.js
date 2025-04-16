import React from 'react';
import { View } from 'react-native';

const Pipe = (props) => {
  const width = props.body.bounds.max.x - props.body.bounds.min.x;
  const height = props.body.bounds.max.y - props.body.bounds.min.y;
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;

  const pipeStyle = {
    position: 'absolute',
    left: x,
    top: y,
    width,
    height,
    backgroundColor: '#66BB6A',  // Base green color
    borderRadius: 5,             // Rounded corners for a smoother look
    shadowColor: '#000',         // Adds depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,
    elevation: 5,
  };

  return <View style={pipeStyle} />;
};

export default Pipe;
