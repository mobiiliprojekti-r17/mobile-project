
import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import pipeStyles from "../styles/pipeStyles";

const Pipe = ({ body, size }) => {
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;
  return (
    <View
      style={[
        pipeStyles.pipe,
        { left: x, top: y, width: size[0], height: size[1] },
      ]}
    />
  );
};

Pipe.propTypes = {
  body: PropTypes.object.isRequired,
  size: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default Pipe;
