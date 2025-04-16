import { useState } from "react";
import { generateBoard } from "../components/generateboard";

const DIFFICULTY_LEVELS = {
  EASY: { size: 8, mines: 10 },
  MEDIUM: { size: 10, mines: 20 },
  HARD: { size: 12, mines: 30 },
};

const useMinesweeper = (initialDifficulty = "EASY") => {
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [remainingMines, setRemainingMines] = useState(DIFFICULTY_LEVELS[initialDifficulty].mines);
  const [isFirstClick, setIsFirstClick] = useState(true);

  const resetGame = () => {
    const { size, mines } = DIFFICULTY_LEVELS[difficulty];
    setRemainingMines(mines);
    const emptyBoard = Array(size)
      .fill()
      .map(() =>
        Array(size)
          .fill()
          .map(() => ({
            mine: false,
            revealed: false,
            flagged: false,
            number: 0,
          }))
      );
    setBoard(emptyBoard);
    setGameOver(false);
    setWin(false);
    setIsFirstClick(true);
  };

  const revealAllTiles = () => {
    setBoard((prev) =>
      prev.map((row) => row.map((cell) => ({ ...cell, revealed: true })))
    );
  };

  const revealCells = (board, row, col) => {
    if (board[row][col].revealed || board[row][col].flagged) return;
    board[row][col].revealed = true;
    if (board[row][col].number === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr,
            nc = col + dc;
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
    return board.every((row) =>
      row.every((cell) => cell.mine || cell.revealed)
    );
  };

  const flagTile = (row, col) => {
    if (gameOver || win) return;
    if (board[row][col].revealed) return;
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

  const revealTile = (row, col) => {
    if (gameOver || win) return;

    if (isFirstClick) {
      const { size, mines } = DIFFICULTY_LEVELS[difficulty];
      const newBoard = generateBoard(size, mines, row, col); 
      setBoard(newBoard);
      setIsFirstClick(false);
      revealCells(newBoard, row, col);
      if (checkWin(newBoard)) {
        setWin(true);
        revealAllTiles();
      }
      return;
    }

    const newBoard = board.map((r) => r.map((cell) => ({ ...cell })));
    if (newBoard[row][col].mine) {
      newBoard[row][col].exploded = true;
      setBoard(newBoard);
      setGameOver(true);
      revealAllMines();
      return;
    }
    revealCells(newBoard, row, col);
    setBoard(newBoard);
    if (checkWin(newBoard)) {
      setWin(true);
      revealAllTiles();
    }
  };

  return { board, gameOver, win, difficulty, remainingMines, resetGame, revealTile, flagTile, changeDifficulty, revealAllTiles};
};

export default useMinesweeper;