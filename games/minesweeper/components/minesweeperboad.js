import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const Board = ({ board, revealTile, flagTile, difficulty }) => {
  // Asetetaan laudan koko vaikeustason mukaan
  const getBoardSize = (difficulty) => {
    switch (difficulty) {
      case "medium":
        return 10;
      case "hard":
        return 12;
      case "easy":
      default:
        return 8;
    }
  };

  const size = getBoardSize(difficulty); // Lasketaan koko vaikeustason mukaan
  const tileSize = 27; // Solun koko (voit säätää tätä tarvittaessa)

  return (
    <View
      style={{
        backgroundColor: "white", // Valkoinen tausta
        padding: 5, // Lisää tilaa valkoisen laatikon ympärille
        opacity: 0.8, // Läpimäkyvyys (0 on täysin läpinäkyvä, 1 täysin peittävä)
        borderRadius: 10, // Kulmien pyöristys
        shadowColor: "#000", // Varjo efektin lisääminen
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 5,
        justifyContent: "center", // Keskitetään pelilauta
        alignItems: "center", // Pelilauta keskelle // Laatikon korkeus määräytyy vaikeustason mukaan
      }}
    >
      {board.map((row, rowIndex) => (
        <View style={{ flexDirection: "row" }} key={rowIndex}>
          {row.map((cell, colIndex) => (
            <TouchableOpacity
              key={colIndex}
              onPress={() => revealTile(rowIndex, colIndex)}
              onLongPress={() => flagTile(rowIndex, colIndex)}
              style={{
                width: tileSize,
                height: tileSize,
                margin: 2,
                backgroundColor: cell.revealed ? "rgb(63, 210, 136)" : "rgb(170, 254, 212)",
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
