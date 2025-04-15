// hooks/useMinesweeper.js
import { useState } from "react";
import { generateBoard } from "../components/generateboard";

const DIFFICULTY_LEVELS = {
  easy: { size: 8, mines: 10 },
  medium: { size: 10, mines: 20 },
  hard: { size: 12, mines: 30 },
};

const useMinesweeper = (initialDifficulty = "easy") => {
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [remainingMines, setRemainingMines] = useState(DIFFICULTY_LEVELS[initialDifficulty].mines);

  const resetGame = () => {
    const { size, mines } = DIFFICULTY_LEVELS[difficulty];
    setRemainingMines(mines);
    setBoard(generateBoard(size, mines));
    setGameOver(false);
    setWin(false);
  };

  // Funktioiden paljastus, liputus jne. voidaan myös siirtää tänne

  const revealAllTiles = () => {
    setBoard((prev) =>
      prev.map((row) => row.map((cell) => ({ ...cell, revealed: true })))
    );
  };

 // hooks/useMinesweeper.js (osa funktiota)
const revealTile = (row, col) => {
    if (gameOver || win) return;
  
    // Kopioidaan nykyinen lauta
    const newBoard = board.map((r) => r.map((cell) => ({ ...cell })));
  
    // Jos solussa on pommi, asetetaan eksplosio
    if (newBoard[row][col].mine) {
      newBoard[row][col].exploded = true;  // Tämä tila käytetään solun punaisena näyttämisenä
      setBoard(newBoard);
      // Aseta pelin tilaksi gameOver
      setGameOver(true);
      // Optionaalisesti: paljasta kaikki pommit
      revealAllMines();
      return;
    }
  
    // Jos solussa ei ole pommia, jatketaan normaalilla paljastuksella
    revealCells(newBoard, row, col);
    setBoard(newBoard);
  
    if (checkWin(newBoard)) {
      setWin(true);
      revealAllTiles();
    }
  };
  

  const revealCells = (board, row, col) => {
    if (board[row][col].revealed || board[row][col].flagged) return;
    board[row][col].revealed = true;
    if (board[row][col].number === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr, nc = col + dc;
          if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) {
            revealCells(board, nr, nc);
          }
        }
      }
    }
  };

  const revealAllMines = () => {
    setBoard((prev) =>
      prev.map((row) =>
        row.map((cell) => (cell.mine ? { ...cell, revealed: true } : cell))
      )
    );
  };

  const checkWin = (board) => {
    return board.every((row) => row.every((cell) => cell.mine || cell.revealed));
  };

  const flagTile = (row, col) => {
    if (gameOver || win) return;
    if (board[row][col].revealed) return;
    // Päivitä liputuksen logiikkaa
    const targetCell = board[row][col];
    if (targetCell.flagged) {
      setRemainingMines((prev) => prev + 1);
    } else {
      setRemainingMines((prev) => prev - 1);
    }
    setBoard((prevBoard) =>
      prevBoard.map((r, ri) =>
        r.map((cell, ci) =>
          ri === row && ci === col ? { ...cell, flagged: !cell.flagged } : cell
        )
      )
    );
  };

  const changeDifficulty = (newDifficulty) => {
    setDifficulty(newDifficulty);
    resetGame();
  };

  return {
    board,
    gameOver,
    win,
    difficulty,
    remainingMines,
    resetGame,
    revealTile,
    flagTile,
    changeDifficulty,
    revealAllTiles,
  };
};

export default useMinesweeper;
