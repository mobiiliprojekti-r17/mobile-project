import React, { useMemo } from "react";
import { View } from "react-native";

export const Paddle = (props) => {
  const { body } = props;
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;
  
  const paddleColor = "#F78DA7";
  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: paddleColor,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "white",
        shadowColor: paddleColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 2.5,
      }}
    />
  );
};

export const Ball = (props) => {
  const { body, color, themeIndex } = props;
  const { position } = body;

  const pastelColors = [
    "#FFB3BA",
    "#FFDFBA",
    "#FFFFBA",
    "#BAFFC9",
    "#BAE1FF",
    "#E3BAFF",
  ];

  const ballColor = color || pastelColors[(themeIndex || 0) % pastelColors.length];

  return (
    <View
      style={{
        position: "absolute",
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: ballColor,
        left: position.x - 12,
        top: position.y - 12,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: ballColor,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 2.5,
      }}
    >
    </View>
  );
};

export const Brick = (props) => {
  const { body } = props;
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  const label = body.label || "";
  const rowMatch = label.match(/brick_\d+_(\d+)/);
  const row = rowMatch ? parseInt(rowMatch[1], 10) : 0;

  const pastelColors = [
    "#FFB3BA",
    "#FFDFBA", 
    "#FFFFBA", 
    "#BAFFC9",
    "#BAE1FF",
    "#E3BAFF",
  ];

  const brickColor = label.includes("special")
    ? "white"
    : pastelColors[row % pastelColors.length];

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: "#d3d3d3", 
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: width - 4, 
          height: height - 4,
          backgroundColor: brickColor,
          borderWidth: 1,
          borderColor: "#aaa",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            right: 2,
            height: 1,
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 2,
            left: 2,
            right: 2,
            height: 1,
            backgroundColor: "rgba(255,255,255,0.3)",
          }}
        />
      </View>
    </View>
  );
};

