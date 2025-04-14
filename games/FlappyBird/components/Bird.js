import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import birdStyles from '../styles/birdStyles';

const Bird = ({ birdBottom }) => {
  return <View style={[birdStyles.bird, { bottom: birdBottom }]} />;
};

Bird.propTypes = {
  birdBottom: PropTypes.number.isRequired,
};


export default Bird;
