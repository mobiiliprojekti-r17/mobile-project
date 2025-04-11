import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import pipeStyles from '../styles/pipeStyles';

const Pipe = ({ pipesLeft, height, bottom }) => {
  return (
    <View style={[pipeStyles.pipe, { left: pipesLeft, height, bottom }]} />
  );
};

Pipe.propTypes = {
  pipesLeft: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  bottom: PropTypes.number.isRequired,
};

export default Pipe;
