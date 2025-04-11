import React from 'react';
import { View } from 'react-native';
import pipeStyles from '../styles/pipeStyles';

const Pipe = ({ pipesLeft, height, bottom }) => {
  return (
    <View style={[pipeStyles.pipe, { left: pipesLeft, height, bottom }]} />
  );
};

export default Pipe;