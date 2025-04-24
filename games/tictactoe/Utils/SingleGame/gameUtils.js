// Tarkistaa, löytyykö laudalta voittorivi ja kuka on voittaja
export const checkWinner = board => {
  const lines = [                           // Kaikki mahdolliset voittorivit
    [0,1,2], [3,4,5], [6,7,8],              // vaakarivit
    [0,3,6], [1,4,7], [2,5,8],              // pystyrivit
    [0,4,8], [2,4,6]                        // vinorivit
  ];
  for (let [a,b,c] of lines) {  // Käy läpi jokaisen voittorivin
    // Jos kaikissa kolmessa kohdassa on sama merkki (eikä null), palautetaan se merkki
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;   // Ei voittajaa
};

// Minimax-algoritmi laskee parhaan pelituloksen ('O' = +1, 'X' = -1, tasapeli = 0)
export const minimax = (board, isMaximizing) => {
  const winner = checkWinner(board);
  if (winner === 'O') return 1;             // Tekoäly voitti
  if (winner === 'X') return -1;            // Pelaaja voitti
  if (!board.includes(null)) return 0;      // Laudalla ei ole enää tyhjiä ruutuja -> tasapeli

  if (isMaximizing) {   // Tekoälyn vuoro
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {                  
        board[i] = 'O'; 
        best = Math.max(best, minimax(board, false)); 
        board[i] = null;
      }
    }
    return best;
  } else {  // Pelaajan vuoro
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'X';  // kokeillaan pelaajan siirtoa
        best = Math.min(best, minimax(board, true));  // otetaan pelaajalle huonoin tekoälylle
        board[i] = null;
      }
    }
    return best;
  }
};

// Valitsee tekoälyn siirron vaikeustason mukaan
export const makeAIMove = (board, level) => {
  if (level === 'easy') {
    // Helppo: tekoäly valitsee satunnaisen tyhjän ruudun
    const empties = board
      .map((v,i) => v === null ? i : null)
      .filter(i => i !== null);
    return empties[Math.floor(Math.random() * empties.length)];
  }
  if (level === 'medium') {
    // Keskitaso: tekoäly etsii ensin voittavan siirto (O), sitten estävän (X)
    for (let mark of ['O','X']) {
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          board[i] = mark;
          if (checkWinner(board) === mark) {
            board[i] = null;
            return i;   // palauta ratkaiseva siirto
          }
          board[i] = null;
        }
      }
    }
    // Jos ei löydy tärkeitä siirtoja tee helppo siirto
    return makeAIMove(board, 'easy');
  }
  if (level === 'impossible') {
    // Vaikea: tekoäly arvioi minimaxilla kaikki siirrot ja valitsee parhaimman
    let bestScore = -Infinity, move = null;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, false);  // laskee siirron arvion
        board[i] = null;
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  }
  // Oletuksena keskitaso, jos tasoa ei tunnisteta
  return makeAIMove(board, 'medium');
};
