import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { checkWinner, checkDraw, dropDisc } from '../Logic/Connect4Logic';
import { getLandingRowAndToY } from '../Logic/BoardUtils';

// Käytetään kahden pelaajan vuoropohjaista logiikkaa ilman AI:ta
export const useGameLogicMulti = ( ROWS, COLS, TOTAL_CELL_WIDTH, BOARD_PADDING, CELL_MARGIN, X_OFFSET_CORRECTION ) => {
  // 2D-taulukko, jossa null = tyhjä solu
  const [board, setBoard] = useState(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  // Pelaajien värit vuorottain: Orange aloittaa
  const [currentPlayer, setCurrentPlayer] = useState('Orange');
  // Voittaja, 'Orange', 'Yellow' tai 'Draw'
  const [winner, setWinner] = useState(null);
  // Lopputulos‑modalin näyttö
  const [modalVisible, setModalVisible] = useState(false);
  // Voittorivin koordinaatit korostusta varten
  const [winnerCoords, setWinnerCoords] = useState([]);
  // Animoitu pudottelukiekko
  const [flyingDisc, setFlyingDisc] = useState(null);

  // Yhden solun sisäisen kiekon koko
  const computedCellSize = TOTAL_CELL_WIDTH - 2 * CELL_MARGIN;

  // Pelaajan klikkauksen käsittelijä
  const handlePlayerMove = (col) => {
    if (winner || flyingDisc) return;  // Estetään, jos peli on jo päättynyt tai animaatio kesken

    // Lasketaan, mille riville kiekko putoaa ja Y‑koordinaatti
    const landingData = getLandingRowAndToY(board, TOTAL_CELL_WIDTH, col);
    if (!landingData) return;

    // Lasketaan vaakasiirto ruudulle: keskitetään lauta näytölle
    const screenWidth = Dimensions.get('window').width;
    const boardWidth = COLS * TOTAL_CELL_WIDTH;
    const boardStartX = (screenWidth - boardWidth) / 2;
    const xOffset = boardStartX + col * TOTAL_CELL_WIDTH;

    // Asetetaan animoitu kiekko putoamaan
    setFlyingDisc({
      color:
        currentPlayer === 'Orange'
          ? 'rgb(255, 94, 0)'   // oranssi
          : 'rgb(255, 234, 0)', // keltainen
      col,
      xOffset,
      toY: landingData.toY,
      cellSize: computedCellSize,
      onEnd: () => {
        // Kun animaatio päättyy, päivitetään lauta
        setFlyingDisc(null);
        const result = dropDisc(board, col, currentPlayer);
        if (!result) return;
        const { newBoard } = result;
        setBoard(newBoard);

        // Tarkistetaan voittaja tai tasapeli
        const winInfo = checkWinner(newBoard);
        if (winInfo) {
          // checkWinner palauttaa { winner, coords } tai yksinkertaisen stringin
          setWinner(winInfo.winner || winInfo);
          setWinnerCoords(winInfo.coords || []);
          setModalVisible(true);
        } else if (checkDraw(newBoard)) {
          setWinner('Draw');
          setModalVisible(true);
        } else {
          // Vaihdetaan vuoro toiselle pelaajalle
          setCurrentPlayer(
            currentPlayer === 'Orange' ? 'Yellow' : 'Orange'
          );
        }
      },
    });
  };

  // Aloittaa uuden pelin nollaamalla kaiken tilan
  const startNewGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setWinner(null);
    setWinnerCoords([]);
    setCurrentPlayer('Orange');
    setModalVisible(false);
    setFlyingDisc(null);
  };

  return { board, currentPlayer, winner, modalVisible, winnerCoords, flyingDisc, handlePlayerMove, startNewGame, setModalVisible, setFlyingDisc };
};
