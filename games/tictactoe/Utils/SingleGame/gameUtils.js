
export const checkWinner = board => {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let [a,b,c] of lines) {
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  };
  
  export const minimax = (board, isMaximizing) => {
    const winner = checkWinner(board);
    if (winner === 'O') return 1;
    if (winner === 'X') return -1;
    if (!board.includes(null)) return 0;
  
    if (isMaximizing) {
      let best = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'O';
          best = Math.max(best, minimax(board, false));
          board[i] = null;
        }
      }
      return best;
    } else {
      let best = Infinity;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'X';
          best = Math.min(best, minimax(board, true));
          board[i] = null;
        }
      }
      return best;
    }
  };
  
  export const makeAIMove = (board, level) => {
    if (level === 'easy') {
      const empties = board.map((v,i) => v ? null : i).filter(i => i !== null);
      return empties[Math.floor(Math.random() * empties.length)];
    }
    if (level === 'medium') {
      for (let mark of ['O','X']) {
        for (let i = 0; i < 9; i++) {
          if (!board[i]) {
            board[i] = mark;
            if (checkWinner(board) === mark) {
              board[i] = null;
              return i;
            }
            board[i] = null;
          }
        }
      }
      return makeAIMove(board, 'easy');
    }
    if (level === 'impossible') {
      let bestScore = -Infinity, move = null;
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = 'O';
          const score = minimax(board, false);
          board[i] = null;
          if (score > bestScore) {
            bestScore = score;
            move = i;
          }
        }
      }
      return move;
    }
    return makeAIMove(board, 'medium');
  };
  