import sudoku from 'sudoku';

export function generateBoard(level) {
  const lvl = level.toUpperCase();
  const filledCells = lvl === 'EASY' ? 60 : lvl === 'HARD' ? 30 : 40;
  const solved = sudoku.solvepuzzle(sudoku.makepuzzle());

  const board = Array.from({ length: 9 }, (_, i) =>
    Array.from({ length: 9 }, (_, j) => ({
      value: solved[i * 9 + j] != null ? String(solved[i * 9 + j] + 1) : '',
      preFilled: true,
      notes: [],
      isError: false,
    }))
  );

  let toRemove = 81 - filledCells;
  while (toRemove > 0) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (board[r][c].value) {
      board[r][c].value = '';
      board[r][c].preFilled = false;
      toRemove--;
    }
  }
  return board;
}

export function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function validateBoard(board) {
  const errors = Array.from({ length: 9 }, () => Array(9).fill(false));
  let hasError = false;

  const markDuplicates = positions => {
    const map = {};
    positions.forEach(([i, j]) => {
      const val = board[i][j].value;
      if (!val) return;
      if (map[val]) {
        const [pi, pj] = map[val];
        if (!board[pi][pj].preFilled) {
          errors[pi][pj] = true;
          hasError = true;
        }
        if (!board[i][j].preFilled) {
          errors[i][j] = true;
          hasError = true;
        }
      } else {
        map[val] = [i, j];
      }
    });
  };

  board.forEach((row, i) =>
    row.forEach((cell, j) => {
      if (!cell.value && !cell.preFilled) {
        errors[i][j] = true;
        hasError = true;
      }
    })
  );

  for (let i = 0; i < 9; i++) {
    markDuplicates(Array.from({ length: 9 }, (_, j) => [i, j]));
    markDuplicates(Array.from({ length: 9 }, (_, j) => [j, i]));
  }

  for (let bi = 0; bi < 3; bi++) {
    for (let bj = 0; bj < 3; bj++) {
      const block = [];
      for (let di = 0; di < 3; di++) {
        for (let dj = 0; dj < 3; dj++) {
          block.push([bi * 3 + di, bj * 3 + dj]);
        }
      }
      markDuplicates(block);
    }
  }

  return { errors, hasError };
}

export function handleNumberPress(board, selectedCell, noteMode, num) {
  const { row, col } = selectedCell;
  const copy = board.map(r => r.map(c => ({ ...c, isError: false })));
  if (copy[row][col].preFilled) return copy;

  if (noteMode) {
    const notes = copy[row][col].notes || [];
    copy[row][col].notes = notes.includes(num)
      ? notes.filter(n => n !== num)
      : [...notes, num];
  } else {
    copy[row][col].value = String(num);
    copy[row][col].notes = [];

    for (let j = 0; j < 9; j++) {
      if (j !== col && !copy[row][j].preFilled) {
        copy[row][j].notes = (copy[row][j].notes || []).filter(n => n !== num);
      }
    }
    for (let i = 0; i < 9; i++) {
      if (i !== row && !copy[i][col].preFilled) {
        copy[i][col].notes = (copy[i][col].notes || []).filter(n => n !== num);
      }
    }
    const bi = Math.floor(row / 3) * 3;
    const bj = Math.floor(col / 3) * 3;
    for (let di = 0; di < 3; di++) {
      for (let dj = 0; dj < 3; dj++) {
        const i = bi + di;
        const j = bj + dj;
        if ((i !== row || j !== col) && !copy[i][j].preFilled) {
          copy[i][j].notes = (copy[i][j].notes || []).filter(n => n !== num);
        }
      }
    }
  }
  return copy;
}

export function handleClearPress(board, selectedCell, noteMode) {
  const { row, col } = selectedCell;
  const copy = board.map(r => r.map(c => ({ ...c, isError: false })));
  if (copy[row][col].preFilled) return copy;
  if (noteMode) {
    copy[row][col].notes = [];
  } else {
    copy[row][col].value = '';
  }
  return copy;
}
