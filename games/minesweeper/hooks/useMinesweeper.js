import { useState } from "react";
import { generateBoard } from "../components/generateboard";

const DIFFICULTY_LEVELS = {
  EASY:   { size: 8,  mines: 10 },
  MEDIUM: { size: 10, mines: 20 },
  HARD:   { size: 12, mines: 30 },
};

const useMinesweeper = (initialDifficulty = "EASY") => {
  // Pelaajan valitsema vaikeustaso
  const [difficulty, setDifficulty] = useState(initialDifficulty);
  // Pelilauta
  const [board, setBoard] = useState([]);
  // Merkitsee, onko peli päättynyt miinaan
  const [gameOver, setGameOver] = useState(false);
  // Merkitsee, onko pelaaja voittanut
  const [win, setWin] = useState(false);
  // Kuinka monta miinaa pelaajan liputettavaksi on jäljellä
  const [remainingMines, setRemainingMines] = useState(
    DIFFICULTY_LEVELS[initialDifficulty].mines
  );
  // Ensimmäinen klikkaus generoi laudan ja avaa varmoja ruutuja, ei voi olla miina
  const [isFirstClick, setIsFirstClick] = useState(true);

  // Uudelleenkäynnistä peli: tyhjennä lauta ja tila
  const resetGame = () => {
    const { size, mines } = DIFFICULTY_LEVELS[difficulty];
    setRemainingMines(mines);
    // Luo tyhjän taulukon ilman miinoja
    const emptyBoard = Array(size).fill().map(() =>
      Array(size).fill().map(() => ({
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

  // Paljasta kaikki solut pelin voitossa tai häviössä
  const revealAllTiles = () => {
    setBoard(prev =>
      prev.map(row => row.map(cell => ({ ...cell, revealed: true })))
    );
  };

  // Rekursiivinen avaus: jos solun numero on 0, paljastuu samalla kaikki tyhjät solut ympäriltä
  const revealCells = (board, row, col) => {
    if (board[row][col].revealed || board[row][col].flagged) return;
    board[row][col].revealed = true;
    if (board[row][col].number === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr, nc = col + dc;
          if (
            nr >= 0 && nr < board.length &&
            nc >= 0 && nc < board[0].length
          ) {
            revealCells(board, nr, nc);
          }
        }
      }
    }
  };

  // Paljasta miinasolut häviötilanteessa
  const revealAllMines = () => {
    setBoard(prev =>
      prev.map(row =>
        row.map(cell =>
          cell.mine ? { ...cell, revealed: true } : cell
        )
      )
    );
  };

  // Tarkistaa, ovatko kaikki ei-miinasolut paljastettu
  const checkWin = board =>
    board.every(row =>
      row.every(cell => cell.mine || cell.revealed)
    );

  // Liputtaa tai poistaa liputuksen solusta
  const flagTile = (row, col) => {
    if (gameOver || win) return;
    if (board[row][col].revealed) return;
    // Päivitää  miinoja jäljellä-laskurin
    setRemainingMines(prev =>
      board[row][col].flagged ? prev + 1 : prev - 1
    );
  // jos liputusta ei ollut, asetetaan liputus; jos oli, poistetaan liputus
    setBoard(prevBoard =>
      prevBoard.map((r, ri) =>
        r.map((c, ci) =>
          ri === row && ci === col
            ? { ...c, flagged: !c.flagged }
            : c
        )
      )
    );
  };

  // Vaihda vaikeustasoa ja nollaa peli
  const changeDifficulty = newDifficulty => {
    setDifficulty(newDifficulty);
    resetGame();
  };

  // Käsittelee solun paljastuksen
  const revealTile = (row, col) => {
    if (gameOver || win) return;

    // Ensimmäisellä klikkauksella generoidaan lauta turvallisella alueella eli ei voi olla miinoja heti ekalla painalluksella
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

    // Muut klikkaukset: kopioidaan lauta
    const newBoard = board.map(r => r.map(c => ({ ...c })));
    if (newBoard[row][col].mine) {
      // Osui miinaan: merkitsee räjähtäneeksi ja lopettaa peli
      newBoard[row][col].exploded = true;
      setBoard(newBoard);
      setGameOver(true);
      revealAllMines();
      return;
    }
    // Paljastaa solut ja tarkistaa voiton
    revealCells(newBoard, row, col);
    setBoard(newBoard);
    if (checkWin(newBoard)) {
      setWin(true);
      revealAllTiles();
    }
  };

  return { board, gameOver, win, difficulty, remainingMines, resetGame, revealTile, flagTile, changeDifficulty, revealAllTiles };
};

export default useMinesweeper;
