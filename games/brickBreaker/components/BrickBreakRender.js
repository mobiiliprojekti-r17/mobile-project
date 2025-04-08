import React, { useMemo } from "react";
import { View, Text } from "react-native";


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
        borderColor: "black",
        shadowColor: "white",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 5.5,
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
        borderRadius: 14,
        backgroundColor: ballColor,
        borderWidth: 2,       
        borderColor: "black",    
        left: position.x - 14,
        top: position.y - 14,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: ballColor,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,     
        shadowRadius: 3,
        elevation: 4,
      }}
    />
  );
};
/*
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
*/
export const Brick = (props) => {
  const { body, brickType, damaged, hits } = props;
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  let brickColor;
  if (brickType === "white") {
    brickColor = "white";
  } else if (brickType === "double") {
    brickColor = "#7F00FF";
  } else {
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
    brickColor = pastelColors[row % pastelColors.length];
  }

  const opacity = damaged ? 0.5 : 1;

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
          opacity: opacity,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {brickType === "double" && (
          <Text style={{ color: "black", fontWeight: "bold" }}>
            {hits}
          </Text>
        )}
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
