import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Board = ({ board, revealTile, flagTile }) => {
  return (
    <View>
      {board.map((row, rowIndex) => (
        <View style={{ flexDirection: "row" }} key={rowIndex}>
          {row.map((cell, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              onPress={() => revealTile(rowIndex, colIndex)}  // Klikkaus paljastaa
              onLongPress={() => flagTile(rowIndex, colIndex)} // Pitkä painallus asettaa lipun
              style={{
                width: 30,
                height: 30,
                margin: 2,
                backgroundColor: cell.revealed ? "#ddd" : "#ccc",
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "#999",
              }}
            >
              {cell.revealed && <Text>{cell.value}</Text>}  // Näyttää arvon, jos ruutu on paljastettu
              {cell.flagged && <Text>🚩</Text>}  // Näyttää lipun, jos se on asetettu
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export default Board;
