import React, { useState, useEffect } from "react";
import { View, Button } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native"; 
import Board from "../components/minesweeperboad";
import { generateBoard } from "../components/generateboard";
import { styles } from "../styles/minesweeperStyles";

const DIFFICULTY_LEVELS = {
  easy: { size: 8, mines: 10 },
  medium: { size: 10, mines: 20 },
  hard: { size: 12, mines: 30 },
};

const MinesweeperScreen = () => {
  const route = useRoute();
  const { difficulty } = route.params || { difficulty: "easy" }; // Saadaan vaikeustaso reitiltä
  const [board, setBoard] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const { size, mines } = DIFFICULTY_LEVELS[difficulty];
    setBoard(generateBoard(size, mines)); // Alustetaan pelilauta vaikeustason mukaan
  }, [difficulty]);

  // Paljastaa ruudun
  const revealTile = (row, col) => {
    let newBoard = board.map((r, ri) => r.map((cell, ci) =>
      ri === row && ci === col ? { ...cell, revealed: true } : cell
    ));
    setBoard(newBoard);
  };

  // Asettaa tai poistaa lipun solusta
  const flagTile = (row, col) => {
    let newBoard = board.map((r, ri) => r.map((cell, ci) =>
      ri === row && ci === col ? { ...cell, flagged: !cell.flagged } : cell
    ));
    setBoard(newBoard);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        {/* Voit lisätä vaikeustasovaihtoehdot, jos haluat antaa mahdollisuuden vaihtaa niitä pelin aikana */}
      </View>
      
      <Board 
        board={board} 
        revealTile={revealTile} 
        flagTile={flagTile} 
      />
      
      <Button 
        title="Palaa päävalikkoon" 
        onPress={() => navigation.navigate("Home")} 
      />
    </View>
  );
};

export default MinesweeperScreen;
