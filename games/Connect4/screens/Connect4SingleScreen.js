import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles from '../styles/Connect4SingleStyles';

const ROWS = 6;
const COLS = 7;


const evaluateWindow = (window, player) => {
  let score = 0;
  const opponent = player === 'Orange' ? 'Yellow' : 'Oramge';
  const countPlayer = window.filter(cell => cell === player).length;
  const countOpponent = window.filter(cell => cell === opponent).length;
  const countEmpty = window.filter(cell => cell === null).length;

  if (countPlayer === 4) {
    score += 1000;
  } else if (countPlayer === 3 && countEmpty === 1) {
    score += 10;
  } else if (countPlayer === 2 && countEmpty === 2) {
    score += 5;
  }
  if (countOpponent === 3 && countEmpty === 1) {
    score -= 80;
  }
  return score;
};

const evaluateBoard = (board, player) => {
  let score = 0;
  const centerArray = [];
  for (let row = 0; row < ROWS; row++) {
    centerArray.push(board[row][Math.floor(COLS / 2)]);
  }
  const centerCount = centerArray.filter(cell => cell === player).length;
  score += centerCount * 3;

  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const window = board[row].slice(col, col + 4);
      score += evaluateWindow(window, player);
    }
  }
  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS - 3; row++) {
      const window = [board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]];
      score += evaluateWindow(window, player);
    }
  }
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 0; col < COLS - 3; col++) {
      const window = [
        board[row][col],
        board[row + 1][col + 1],
        board[row + 2][col + 2],
        board[row + 3][col + 3],
      ];
      score += evaluateWindow(window, player);
    }
  }
  for (let row = 0; row < ROWS - 3; row++) {
    for (let col = 3; col < COLS; col++) {
      const window = [
        board[row][col],
        board[row + 1][col - 1],
        board[row + 2][col - 2],
        board[row + 3][col - 3],
      ];
      score += evaluateWindow(window, player);
    }
  }
  return score;
};

const getValidColumns = (board) => {
  let validCols = [];
  for (let col = 0; col < COLS; col++) {
    if (board[0][col] === null) {
      validCols.push(col);
    }
  }
  return validCols;
};

const dropDiscInBoard = (board, col, player) => {
  let newBoard = board.map(row => row.slice());
  for (let row = ROWS - 1; row >= 0; row--) {
    if (newBoard[row][col] === null) {
      newBoard[row][col] = player;
      break;
    }
  }
  return newBoard;
};

const minimax = (board, depth, maximizingPlayer, alpha, beta) => {
  const validColumns = getValidColumns(board);
  const winner = checkWinner(board);
  
  if (depth === 0 || winner !== null || validColumns.length === 0) {
    if (winner === 'Orange') return { score: 1000000 };
    else if (winner === 'Yellow') return { score: -1000000 };
    else return { score: evaluateBoard(board, 'Orange') };
  }

  if (maximizingPlayer) {
    let maxEval = -Infinity;
    let bestColumn = validColumns[0];
    for (let col of validColumns) {
      const newBoard = dropDiscInBoard(board, col, 'Orange');
      const evaluation = minimax(newBoard, depth - 1, false, alpha, beta).score;
      if (evaluation > maxEval) {
        maxEval = evaluation;
        bestColumn = col;
      }
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break;
    }
    return { score: maxEval, column: bestColumn };
  } else {
    let minEval = Infinity;
    let bestColumn = validColumns[0];
    for (let col of validColumns) {
      const newBoard = dropDiscInBoard(board, col, 'Yellow');
      const evaluation = minimax(newBoard, depth - 1, true, alpha, beta).score;
      if (evaluation < minEval) {
        minEval = evaluation;
        bestColumn = col;
      }
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break;
    }
    return { score: minEval, column: bestColumn };
  }
};

const checkWinner = (board) => {

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const cell = board[row][col];
        if (cell && cell === board[row][col + 1] && cell === board[row][col + 2] && cell === board[row][col + 3]) {
          return cell;
        }
      }
    }
    // Pystysuora tarkistus
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS - 3; row++) {
        const cell = board[row][col];
        if (cell && cell === board[row + 1][col] && cell === board[row + 2][col] && cell === board[row + 3][col]) {
          return cell;
        }
      }
    }
    // Diagonaalinen tarkistus (alas-oikealle)
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const cell = board[row][col];
        if (cell && cell === board[row + 1][col + 1] && cell === board[row + 2][col + 2] && cell === board[row + 3][col + 3]) {
          return cell;
        }
      }
    }
    // Diagonaalinen tarkistus (alas-vasemmalle)
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 3; col < COLS; col++) {
        const cell = board[row][col];
        if (cell && cell === board[row + 1][col - 1] && cell === board[row + 2][col - 2] && cell === board[row + 3][col - 3]) {
          return cell;
        }
      }
    }
    return null;
  };
  
const Connect4Singleplayer = ({ navigation }) => {
  const [board, setBoard] = useState(
    Array(ROWS).fill(null).map(() => Array(COLS).fill(null))
  );
  const [currentPlayer, setCurrentPlayer] = useState('Yellow');
  const [winner, setWinner] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const dropDisc = (col) => {
    if (winner || currentPlayer !== 'Yellow') return;
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!board[row][col]) {
        const newBoard = board.map(r => [...r]);
        newBoard[row][col] = 'Yellow';
        setBoard(newBoard);
        const win = checkWinner(newBoard);
        if (win) {
          setWinner(win);
          setModalVisible(true);
        } else {
          setCurrentPlayer('Orange');
        }
        return;
      }
    }
  };

  useEffect(() => {
    if (currentPlayer === 'Orange' && !winner) {
      const aiMove = () => {
        const { column } = minimax(board, 4, true, -Infinity, Infinity);
        for (let row = ROWS - 1; row >= 0; row--) {
          if (!board[row][column]) {
            const newBoard = board.map(r => [...r]);
            newBoard[row][column] = 'Orange';
            setBoard(newBoard);
            const win = checkWinner(newBoard);
            if (win) {
              setWinner(win);
              setModalVisible(true);
            } else {
              setCurrentPlayer('Yellow');
            }
            return;
          }
        }
      };

      const timer = setTimeout(aiMove, 500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayer, board, winner]);

  const renderCell = (row, col) => {
    const cellColor =
      board[row][col] === 'Yellow'
        ? 'rgb(255, 234, 0)'
        : board[row][col] === 'Orange'
        ? 'rgb(255, 94, 0)'
        : 'transparent';

    return (
      <TouchableOpacity
        key={`${row}-${col}`}
        style={styles.cell}
        onPress={() => dropDisc(col)}
      >
        {board[row][col] && (
          <View style={[styles.disc, { backgroundColor: cellColor }]} />
        )}
      </TouchableOpacity>
    );
  };

  const renderBoard = () => {
    return board.map((row, rowIndex) => (
      <View key={rowIndex} style={styles.row}>
        {row.map((_, colIndex) => renderCell(rowIndex, colIndex))}
      </View>
    ));
  };

  const startNewGame = () => {
    setBoard(Array(ROWS).fill(null).map(() => Array(COLS).fill(null)));
    setWinner(null);
    setCurrentPlayer('Yellow');
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connect4</Text>
      {/* Vuoron ilmoitus näytetään vain, jos peli ei ole vielä päättynyt */}
      {!winner && (
        <Text style={styles.player}>
          {currentPlayer === 'Yellow' ? 'Your turn' : 'AI is thinking...'}
        </Text>
      )}

      <View style={styles.board}>{renderBoard()}</View>

      <TouchableOpacity style={styles.button} onPress={startNewGame}>
        <Text style={styles.buttonText}>
          {winner ? 'Start New Game' : 'Restart'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Home</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              {winner === 'Yellow'
                ? 'You win!'
                : winner === 'Orange'
                ? 'AI wins!'
                : ''}
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Connect4Singleplayer;
