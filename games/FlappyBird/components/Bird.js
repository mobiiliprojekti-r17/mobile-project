

import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import birdStyles from "../styles/birdStyles";

const Bird = ({ body, size, color }) => {
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;
  return (
    <View
      style={[
        birdStyles.bird,
        { left: x, top: y, width: size[0], height: size[1], backgroundColor: color || "yellow" },
      ]}
    />
  );
};

Bird.propTypes = {
  body: PropTypes.object.isRequired,
  size: PropTypes.arrayOf(PropTypes.number).isRequired,
  color: PropTypes.string,
};

export default Bird;
