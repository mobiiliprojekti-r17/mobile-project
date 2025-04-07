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
              onPress={() => revealTile(rowIndex, colIndex)}
              onLongPress={() => flagTile(rowIndex, colIndex)}
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
              {cell.revealed && (
                <Text>
                  {cell.mine ? "💣" : cell.number > 0 ? cell.number : ""}
                </Text>
              )}
              {cell.flagged && !cell.revealed && <Text>🚩</Text>}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export default Board;
