import { useState, useEffect } from 'react';
import { checkWinner, checkDraw, minimax, dropDisc, getValidColumns } from '../Logic/Connect4Logic';
import { getLandingRowAndToY } from '../Logic/BoardUtils';

// Hook huolehtii pelin tilasta ja logiikasta Connect4‑pelille
export const useGameLogic = ( ROWS, COLS, TOTAL_CELL_WIDTH, BOARD_PADDING, CELL_MARGIN, X_OFFSET_CORRECTION, difficulty = 'medium') => {
  // Pelilauta 2D-taulukkona, aluksi tyhjä
  const [board, setBoard] = useState(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  // Kumpi pelaaja on vuorossa ('Yellow' tai 'Orange')
  const [currentPlayer, setCurrentPlayer] = useState('Yellow');
  // Voittaja ('Yellow', 'Orange' tai 'Draw')
  const [winner, setWinner] = useState(null);
  // Näytä lopputulos‑modal
  const [modalVisible, setModalVisible] = useState(false);
  // Voittorivin koordinaatit korostusta varten
  const [winnerCoords, setWinnerCoords] = useState([]);
  // Animoitu pudottava kiekko
  const [flyingDisc, setFlyingDisc] = useState(null);

  // Pelaajan (Yellow) klikkauksen käsittelijä
  const handlePlayerMove = (col) => {
    // Klikkaus estetään, jos peli ohi, ei ole keltainen vuorossa tai animaatio kesken
    if (winner || currentPlayer !== 'Yellow' || flyingDisc) return;

    // Lasketaan mille riville kiekko putoaa ja mihin Y‑koordinaattiin
    const landingData = getLandingRowAndToY(board, TOTAL_CELL_WIDTH, col);
    if (!landingData) return;

    // Lasketaan vaakasiirto pikseleissä
    const xOffset =
      BOARD_PADDING + CELL_MARGIN + col * TOTAL_CELL_WIDTH + X_OFFSET_CORRECTION;

    // Asetetaan animoitu kiekko pudotusliikkeelle
    setFlyingDisc({
      color: 'rgb(255, 234, 0)', // keltainen kiekko
      col,
      xOffset,
      toY: landingData.toY,
      cellSize: TOTAL_CELL_WIDTH - 2 * CELL_MARGIN,
      onEnd: () => {
        // Kun animaatio päättyy, päivitetään lauta
        setFlyingDisc(null);
        const result = dropDisc(board, col, 'Yellow');
        if (!result) return;
        const { newBoard } = result;
        setBoard(newBoard);

        // Tarkistetaan voittaja tai tasapeli
        const winnerResult = checkWinner(newBoard);
        if (winnerResult?.winner) {
          setWinner(winnerResult.winner);
          setWinnerCoords(winnerResult.coords);
          setModalVisible(true);
        } else if (checkDraw(newBoard)) {
          setWinner('Draw');
          setModalVisible(true);
        } else {
          // Vaihdetaan vuoro tekoälylle
          setCurrentPlayer('Orange');
        }
      },
    });
  };

  // KTekoälyn vuoro (Orange)
  useEffect(() => {
    if (currentPlayer === 'Orange' && !winner && !flyingDisc) {
      const aiMove = () => {
        let chosenColumn;
        if (difficulty === 'easy') {
          // Helppo taso: teko äly laittaa kiekkoja satunnaisesti
          const valid = getValidColumns(board);
          chosenColumn = valid[Math.floor(Math.random() * valid.length)];
        } else if (difficulty === 'medium') {
          // Keskitaso: minimax syvyydellä 3, voitettavissa 
          chosenColumn = minimax(board, 3, true, -Infinity, Infinity).column;
        } else {
          // Vaikea/mahdoton: syvyys 5, oikeastaan mahdoton voittaa
          chosenColumn = minimax(board, 5, true, -Infinity, Infinity).column;
        }

        // Sama pudotusanimaatio kuin pelaajalla
        const landingData = getLandingRowAndToY(board, TOTAL_CELL_WIDTH, chosenColumn);
        if (!landingData) return;
        const xOffset =
          BOARD_PADDING + CELL_MARGIN + chosenColumn * TOTAL_CELL_WIDTH + X_OFFSET_CORRECTION;

        setFlyingDisc({
          color: 'rgb(255, 94, 0)', // oranssi kiekko
          col: chosenColumn,
          xOffset,
          toY: landingData.toY,
          cellSize: TOTAL_CELL_WIDTH - 2 * CELL_MARGIN,
          onEnd: () => {
            setFlyingDisc(null);
            const result = dropDisc(board, chosenColumn, 'Orange');
            if (!result) return;
            const { newBoard } = result;
            setBoard(newBoard);

            const winnerResult = checkWinner(newBoard);
            if (winnerResult?.winner) {
              setWinner(winnerResult.winner);
              setWinnerCoords(winnerResult.coords);
              setModalVisible(true);
            } else if (checkDraw(newBoard)) {
              setWinner('Draw');
              setModalVisible(true);
            } else {
              // Palautetaan vuoro pelaajalle
              setCurrentPlayer('Yellow');
            }
          },
        });
      };

      // Viive koneen siirrolle: nopeampi mahdottomalla
      const delay = difficulty === 'impossible' ? 10 : 500;
      const timer = setTimeout(aiMove, delay);
      return () => clearTimeout(timer);
    }
  }, [ currentPlayer, board, winner, flyingDisc, difficulty, BOARD_PADDING, CELL_MARGIN, TOTAL_CELL_WIDTH, X_OFFSET_CORRECTION ]);

  // Aloittaa uuden pelin tyhjentämällä tilan
  const startNewGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setWinner(null);
    setWinnerCoords([]);
    setCurrentPlayer('Yellow');
    setModalVisible(false);
    setFlyingDisc(null);
  };

  return { board, currentPlayer, winner, modalVisible, winnerCoords, flyingDisc, handlePlayerMove, startNewGame, setModalVisible };
};
