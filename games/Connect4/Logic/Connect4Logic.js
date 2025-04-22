const ROWS = 6;
const COLS = 7;

// Tarkistaa neljän peräkkäisen kiekon voittoyhdistelmän laudalta
export const checkWinner = (board) => {

    // vaakasuora tarkistus
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const cell = board[row][col];
        if (cell && cell === board[row][col + 1] && cell === board[row][col + 2] && cell === board[row][col + 3]) {
          return { winner: cell, coords: [[row,col],[row,col+1],[row,col+2],[row,col+3]] };
        }
      }
    }
    // pystysuora tarkistus
    for (let col = 0; col < COLS; col++) {
      for (let row = 0; row < ROWS - 3; row++) {
        const cell = board[row][col];
        if (cell && cell === board[row + 1][col] && cell === board[row + 2][col] && cell === board[row + 3][col]) {
          return { winner: cell, coords: [[row,col],[row+1,col],[row+2,col],[row+3,col]] };
        }
      }
    }
    // diagonaali (oikea alas)
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 0; col < COLS - 3; col++) {
        const cell = board[row][col];
        if (cell && cell === board[row + 1][col + 1] && cell === board[row + 2][col + 2] && cell === board[row + 3][col + 3]) {
          return { winner: cell, coords: [[row,col],[row+1,col+1],[row+2,col+2],[row+3,col+3]] };
        }
      }
    }
    // diagonaali (vasen alas)
    for (let row = 0; row < ROWS - 3; row++) {
      for (let col = 3; col < COLS; col++) {
        const cell = board[row][col];
        if (cell && cell === board[row + 1][col - 1] && cell === board[row + 2][col - 2] && cell === board[row + 3][col - 3]) {
          return { winner: cell, coords: [[row,col],[row+1,col-1],[row+2,col-2],[row+3,col-3]] };
        }
      }
    }
    return null;
  };
  // Tarkistaa, onko laudalla enää yhtään tyhjää ruutua → tasapeli
  export const checkDraw = (board) => board.flat().every(cell => cell !== null);

  // Heuristinen arvio laudan tilasta 
  export const evaluateBoard = (board, player) => {
    let score = 0;
      // Keskisarakkeen kontrollointi: keskiruutu on arvokkaampi
    const centerArray = [];
    for (let row = 0; row < ROWS; row++) {
      centerArray.push(board[row][Math.floor(COLS / 2)]);
    }
    const centerCount = centerArray.filter(cell => cell === player).length;
    score += centerCount * 3;
  
      // Käy läpi kaikki 4-ruudun ikkunat vaakaan, pystyyn ja vinoihin
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
  // Tiputtaa kiekon sarakkeeseen, palauttaa uuden laudan ja sijoitusrivin
  export const dropDisc = (board, col, player) => {
    const newBoard = board.map(r => [...r]);
  
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = player;
        return { newBoard, row };
      }
    }
      // Sarake täynnä
    return null;
  };
  
  
// Arvioi yhden neljän ruudun mittaisen ikkunan tilan pistein
  export const evaluateWindow = (window, player) => {
    let score = 0;
    const opponent = player === 'Orange' ? 'Yellow' : 'Orange';
    const countPlayer = window.filter(cell => cell === player).length;
    const countOpponent = window.filter(cell => cell === opponent).length;
    const countEmpty = window.filter(cell => cell === null).length;
  
    if (countPlayer === 4) {   // nelosketju -> max
      score += 1000;
    } else if (countPlayer === 3 && countEmpty === 1) {
      score += 10;
    } else if (countPlayer === 2 && countEmpty === 2) {
      score += 5;
    }
    if (countOpponent === 3 && countEmpty === 1) {
      score -= 80; // estää vastustajan
    }
    return score;
  };

// Palauttaa listan sarakkeista, joihin voi vielä tiputtaa kiekon
  export const getValidColumns = (board) => {
    let validCols = [];
    for (let col = 0; col < COLS; col++) {
      if (board[0][col] === null) {
        validCols.push(col);
      }
    }
    return validCols;
  };

// Tiputtaa kiekon ilman rividataa, käytetään minimaxissa
  export const dropDiscInBoard = (board, col, player) => {
    let newBoard = board.map(row => row.slice());
    for (let row = ROWS - 1; row >= 0; row--) {
      if (newBoard[row][col] === null) {
        newBoard[row][col] = player;
        break;
      }
    }
    return newBoard;
  };
// Minimax-algoritmi tekoälylle impossible vaikeustasossa
  export const minimax = (board, depth, maximizingPlayer, alpha, beta) => {
    const validColumns = getValidColumns(board);
    const winner = checkWinner(board);

    if (depth === 0 || winner !== null || validColumns.length === 0) {
      if (winner === 'Orange') return { score: 1000000 };
      else if (winner === 'Yellow') return { score: -1000000 };
      else return { score: evaluateBoard(board, 'Orange') };
    }
    if (maximizingPlayer) {
      // Jos tekoäly voi voittaa välittömästi, valitaan se siirto
      for (let col of validColumns) {
        const newBoard = dropDiscInBoard(board, col, 'Orange');
        if (checkWinner(newBoard) === 'Orange') {
          return { score: 1000000, column: col };
        }
      }
      // Tarkistetaan, jos pelaaja voi voittaa seuraavalla siirrolla, pyritään estämään se
      for (let col of validColumns) {
        const newBoard = dropDiscInBoard(board, col, 'Yellow');
        if (checkWinner(newBoard) === 'Yellow') {
          return { score: 900000, column: col };
        }
      }
    } else {
      // Minimointipuolella: Pelaaja yrittää voittaa
      for (let col of validColumns) {
        const newBoard = dropDiscInBoard(board, col, 'Yellow');
        if (checkWinner(newBoard) === 'Yellow') {
          return { score: -1000000, column: col };
        }
      }
      // Jos tekoäly voisi voittaa seuraavalla siirrolla, yritetään estää se minimoimalla tilannetta
      for (let col of validColumns) {
        const newBoard = dropDiscInBoard(board, col, 'Orange');
        if (checkWinner(newBoard) === 'Orange') {
          return { score: -900000, column: col };
        }
      }
    }
    // Jos välitöntä voittoa tai estoa ei löytynyt, jatketaan perinteisellä minimax–rekursiolla:
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
  
  