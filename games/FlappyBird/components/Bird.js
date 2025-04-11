import React from 'react';
import { View } from 'react-native';
import birdStyles from '../styles/birdStyles';

const Bird = ({ birdBottom }) => {
  return <View style={[birdStyles.bird, { bottom: birdBottom }]} />;
};

export default Bird;