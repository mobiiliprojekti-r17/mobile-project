import React, { useState } from "react";
import { View, Text, TouchableOpacity, Vibration } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import ExplosionEmoji from './ExplosionEmoji';

const Board = ({ board, revealTile, flagTile, difficulty }) => {
  // Määrittää ruudukon koon valitun vaikeustason perusteella
  const getBoardSize = (difficulty) => {
    switch (difficulty) {
      case "MEDIUM": return 10; // 10x10 ruutua
      case "HARD":   return 12; //12x12 ruutua
      case "EASY":
      default:       return 8; // 8x8 ruutua
    }
  };

  // Seurailee josmiinaa painetaan niin on valmiina räjähdys animaatioita varten
  const [explosions, setExplosions] = useState([]);

  // Käynnistää räjähdysanimaation ja poistaa sen 1s kuluttua
  const triggerExplosion = (row, col) => {
    const key = `${row}-${col}`;
    setExplosions(prev => [...prev, key]);
    setTimeout(() => {
      setExplosions(prev => prev.filter(k => k !== key));
    }, 1000);
  };

  const size = getBoardSize(difficulty);
  const tileSize = 32; // Kiinteä yhden ruudun koko

  return (
    <View style={{
      backgroundColor: "black",
      padding: 2,
      opacity: 0.8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.8,
      shadowRadius: 5,
      justifyContent: "center",
      alignItems: "center",
    }}>
      {board.map((row, rowIndex) => (
        <View style={{ flexDirection: "row" }} key={rowIndex}>
          {row.map((cell, colIndex) => (
            // Yksi ruutu, paljastuu painettaessa, liputetaan pitämällä painettuna
            <TouchableOpacity
              key={`${rowIndex}-${colIndex}`}
              onPress={() => {
                if (!cell.revealed && cell.mine) {    // Jos avataan miina, saadaan värinä ja animaatio häviön merkiksi
                  Vibration.vibrate(300);
                  triggerExplosion(rowIndex, colIndex);
                }
                revealTile(rowIndex, colIndex);      // Paljastaa ruudun
              }}
              onLongPress={() => flagTile(rowIndex, colIndex)} // Liputa/poista liputus
              style={{
                width: tileSize,
                height: tileSize,
                backgroundColor: cell.revealed
                  ? (cell.mine && cell.exploded ? "red" : "rgb(63, 210, 136)")
                  : "white",                        // Värikoodit paljastetulle ja piilotetulle
                justifyContent: "center",
                alignItems: "center",
                borderWidth: 1,
                borderColor: "black",
              }}
            >
              {cell.revealed && (
                <>
                  {cell.mine && cell.exploded ? (
                    // Näytä räjähdysanimaatio ja staattinen emoji
                    explosions.includes(`${rowIndex}-${colIndex}`)
                      ? <ExplosionEmoji size={tileSize} />
                      : <Text style={{ fontSize: tileSize * 0.9, color: "red" }}>💥</Text>
                  ) : cell.mine ? (
                    // Näytä miinakuva
                    <Icon name="bomb" size={tileSize * 0.8} color="black" />
                  ) : cell.number > 0 ? (
                    // Näytä numero, jos vieressä on miinoja
                    <Text style={{
                      fontWeight: 'bold',
                      fontSize: tileSize * 0.8,
                      color: 'black',
                    }}>{cell.number}</Text>
                  ) : null}
                </>
              )}
              {cell.flagged && !cell.revealed && (
                // Liputus, merkkinä punainen lippu
                <Icon name="flag" size={tileSize * 0.8} color="red" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

export default Board;
