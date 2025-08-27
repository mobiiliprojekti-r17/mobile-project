export const revealCells = (board, row, col) => {
  // Jos solu on jo paljastettu tai merkitty lipulla, älä tee mitään
  if (board[row][col].revealed || board[row][col].flagged) return;

  // Merkitsee tämän solu paljastetuksi
  board[row][col].revealed = true;

  // Jos solun vieressä ei ole yhtään miinaa, paljasta myös kaikki sen ympärillä
  if (board[row][col].number === 0) {
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        const nr = row + dr,
              nc = col + dc;
        // Varmista, että viereisien solujenkoordinaatit ovat laudalla
        if (nr >= 0 && nr < board.length && nc >= 0 && nc < board[0].length) {
          // Kutsu funktiota uudelleen viereisille soluille
          revealCells(board, nr, nc);
        }
      }
    }
  }

  // Palautetaan päivitetty pelilauta
  return board;
};
