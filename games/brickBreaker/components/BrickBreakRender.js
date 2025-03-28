


import React from "react";
import { View } from "react-native";

export const Paddle = (props) => {
  const { body } = props;
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: "blue",
      }}
    />
  );
};

export const Ball = (props) => {
  const { body, color } = props;
  const { position } = body;

  return (
    <View style={{
      position: 'absolute',
      width: 20,
      height: 20,
      backgroundColor: color || 'red',  
      borderRadius: 10,
      left: position.x - 10,
      top: position.y - 10,
    }} />
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
 
   const rowColors = ["#FF6B6B", "#FFA94D", "#FFD43B", "#69DB7C", "#4DABF7", "#D0BFFF"];
   const color = rowColors[row % rowColors.length]; 

   const isSpecial = label.includes("special");
   const specialColor = isSpecial ? "white": color;
 
 

  return (
    <View
      style={{
        position: "absolute",
        left: x,  
        top: y,
        width: width,
        height: height,
        backgroundColor: color,
        backgroundColor: specialColor, 

      }}
    />
  );
};


