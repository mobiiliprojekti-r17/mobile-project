export const generateBoard = (size, minesCount, safeRow, safeCol) => {

  let board = Array(size).fill().map(() =>
    Array(size).fill().map(() => ({
      mine: false,
      revealed: false,
      flagged: false,
      number: 0,
    }))
  );

  let placedMines = 0;
  while (placedMines < minesCount) {
    let row = Math.floor(Math.random() * size);
    let col = Math.floor(Math.random() * size);
    if (Math.abs(row - safeRow) <= 1 && Math.abs(col - safeCol) <= 1) {
      continue;
    }
    if (!board[row][col].mine) {
      board[row][col].mine = true;
      placedMines++;
    }
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          let nr = r + dr, nc = c + dc;
          if (nr >= 0 && nr < size && nc >= 0 && nc < size && board[nr][nc].mine) {
            count++;
          }
        }
      }
      board[r][c].number = count;
    }
  }

  return board;
};