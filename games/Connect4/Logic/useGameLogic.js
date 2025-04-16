// useGameLogic.js
import { useState, useEffect } from 'react';
import { checkWinner, checkDraw, minimax, dropDisc } from '../Logic/Connect4Logic';
import { getLandingRowAndToY } from '../Logic/BoardUtils';

export const useGameLogic = (ROWS, COLS, TOTAL_CELL_WIDTH, BOARD_PADDING, CELL_MARGIN, X_OFFSET_CORRECTION) => {
  const [board, setBoard] = useState(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState('Yellow');
  const [winner, setWinner] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [winnerCoords, setWinnerCoords] = useState([]);
  const [flyingDisc, setFlyingDisc] = useState(null);

  const handlePlayerMove = (col) => {
    if (winner || currentPlayer !== 'Yellow' || flyingDisc) return;

    const landingData = getLandingRowAndToY(board, TOTAL_CELL_WIDTH, col);
    if (!landingData) return;

    const xOffset = BOARD_PADDING + CELL_MARGIN + col * TOTAL_CELL_WIDTH + X_OFFSET_CORRECTION;

    setFlyingDisc({
      color: 'rgb(255, 234, 0)',
      col,
      xOffset,
      toY: landingData.toY,
      cellSize: TOTAL_CELL_WIDTH - 2 * CELL_MARGIN,
      onEnd: () => {
        setFlyingDisc(null);
        const result = dropDisc(board, col, 'Yellow');
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
          setCurrentPlayer('Orange');
        }
      },
    });
  };

  useEffect(() => {
    if (currentPlayer === 'Orange' && !winner && !flyingDisc) {
      const aiMove = () => {
        const { column } = minimax(board, 4, true, -Infinity, Infinity);
        const landingData = getLandingRowAndToY(board, TOTAL_CELL_WIDTH, column);
        if (!landingData) return;
        const xOffset = BOARD_PADDING + CELL_MARGIN + column * TOTAL_CELL_WIDTH + X_OFFSET_CORRECTION;

        setFlyingDisc({
          color: 'rgb(255, 94, 0)',
          col: column,
          xOffset,
          toY: landingData.toY,
          cellSize: TOTAL_CELL_WIDTH - 2 * CELL_MARGIN,
          onEnd: () => {
            setFlyingDisc(null);
            const result = dropDisc(board, column, 'Orange');
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
              setCurrentPlayer('Yellow');
            }
          },
        });
      };
      const timer = setTimeout(aiMove, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, board, winner, flyingDisc, BOARD_PADDING, CELL_MARGIN, TOTAL_CELL_WIDTH, X_OFFSET_CORRECTION]);

  const startNewGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setWinner(null);
    setWinnerCoords([]);
    setCurrentPlayer('Yellow');
    setModalVisible(false);
    setFlyingDisc(null);
  };

  return {
    board,
    currentPlayer,
    winner,
    modalVisible,
    winnerCoords,
    flyingDisc,
    handlePlayerMove,
    startNewGame,
    setModalVisible,
  };
  
};
