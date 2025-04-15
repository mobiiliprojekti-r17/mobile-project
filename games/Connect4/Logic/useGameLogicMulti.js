import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { checkWinner, checkDraw, dropDisc } from '../Logic/Connect4Logic';
import { getLandingRowAndToY } from '../Logic/BoardUtils';

export const useGameLogicMulti = (ROWS, COLS, TOTAL_CELL_WIDTH, BOARD_PADDING, CELL_MARGIN, X_OFFSET_CORRECTION) => {
  const [board, setBoard] = useState(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState('Orange');
  const [winner, setWinner] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [winnerCoords, setWinnerCoords] = useState([]);
  const [flyingDisc, setFlyingDisc] = useState(null);

  const computedCellSize = TOTAL_CELL_WIDTH - 2 * CELL_MARGIN;

  const handlePlayerMove = (col) => {
    if (winner || flyingDisc) return;
    const landingData = getLandingRowAndToY(board, TOTAL_CELL_WIDTH, col);
    if (!landingData) return;

    const screenWidth = Dimensions.get('window').width;
    const boardWidth = COLS * TOTAL_CELL_WIDTH;
    const boardStartX = (screenWidth - boardWidth) / 2;
    const xOffset = boardStartX + col * TOTAL_CELL_WIDTH;

    setFlyingDisc({
      color: currentPlayer === 'Orange' ? 'rgb(255, 94, 0)' : 'rgb(255, 234, 0)',
      col,
      xOffset,
      toY: landingData.toY,
      cellSize: computedCellSize,
      onEnd: () => {
        setFlyingDisc(null);
        const result = dropDisc(board, col, currentPlayer);
        if (!result) return;
        const { newBoard } = result;
        setBoard(newBoard);

        const win = checkWinner(newBoard);
        if (win) {
          setWinner(win.winner || win);
          setWinnerCoords(win.coords || []);
          setModalVisible(true);
        } else if (checkDraw(newBoard)) {
          setWinner('Draw');
          setModalVisible(true);
        } else {
          setCurrentPlayer(currentPlayer === 'Orange' ? 'Yellow' : 'Orange');
        }
      },
    });
  };

  const startNewGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setWinner(null);
    setWinnerCoords([]);
    setCurrentPlayer('Orange');
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
    setFlyingDisc,
  };
};
