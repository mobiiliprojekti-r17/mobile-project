export const generateBoard = (size, minesCount, safeRow, safeCol) => {
  // Luo koko pelilaudan ilman miinoja tai tyhjiä soluja
  let board = Array(size).fill().map(() =>
    Array(size).fill().map(() => ({
      mine: false,      // Onko miina tässä solussa
      revealed: false,  // Onko solu paljastettu pelaajalle
      flagged: false,   // Onko solu liputettu (pelaajan merkintä)
      number: 0,        // Montako viereistä miinaa tässä ruudussa
    }))
  );

  // Asettaa satunnaisesti miinoja, kunnes niitä on minesCount verran
  let placedMines = 0;
  while (placedMines < minesCount) {
    let row = Math.floor(Math.random() * size);
    let col = Math.floor(Math.random() * size);
    // Ei astea miinaa ensimmäisen klikkauksen ympäröimään 3×3-alueeseen
    if (Math.abs(row - safeRow) <= 1 && Math.abs(col - safeCol) <= 1) {
      continue;
    }
    if (!board[row][col].mine) {
      board[row][col].mine = true;  // Merkitsee miinan
      placedMines++;
    }
  }

  // Laskee jokaiselle ei-miinasolulle viereisten miinojen määrän
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (board[r][c].mine) continue; // Ohitaa miinasolut
      let count = 0;
      // Kiertää 3×3-alueen ympäriltä laskien miinat
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          let nr = r + dr, nc = c + dc;
          if (
            nr >= 0 && nr < size &&
            nc >= 0 && nc < size &&
            board[nr][nc].mine
          ) {
            count++;
          }
        }
      }
      board[r][c].number = count;  // Tallentaa lasketun numeron
    }
  }

  return board;  // Palautaa valmiin pelilaudan
};
