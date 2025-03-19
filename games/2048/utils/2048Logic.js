export const initializeGrid = () => {
    let grid = Array(4)
      .fill()
      .map(() => Array(4).fill(0));
  
    addSpecificTile(grid, 2); // Ensimmäinen "2"-laatta
    addSpecificTile(grid, 2); // Toinen "2"-laatta
  
    return grid;
  };
  
  // Lisää uuden laatan satunnaiseen tyhjään ruutuun
  const addRandomTile = (grid) => {
    let emptyTiles = [];
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) emptyTiles.push({ i, j });
      });
    });
  
    if (emptyTiles.length > 0) {
      let { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      grid[i][j] = Math.random() > 0.1 ? 2 : 4; // 90% todennäköisyydellä 2, 10% 4
    }
  };
  
  // Lisää tietyn arvon (vain alussa käytettävä)
  const addSpecificTile = (grid, value) => {
    let emptyTiles = [];
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 0) emptyTiles.push({ i, j });
      });
    });
  
    if (emptyTiles.length > 0) {
      let { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      grid[i][j] = value;
    }
  };
  
  const slide = (row) => {
    let newRow = row.filter((num) => num !== 0);
    for (let i = 0; i < newRow.length - 1; i++) {
      if (newRow[i] === newRow[i + 1]) {
        newRow[i] *= 2;
        newRow[i + 1] = 0;
      }
    }
    newRow = newRow.filter((num) => num !== 0);
    while (newRow.length < 4) {
      newRow.push(0);
    }
    return newRow;
  };
  
  export const moveTiles = (grid, direction) => {
    let newGrid = grid.map((row) => [...row]);
    let originalGrid = JSON.stringify(grid); // Tallennetaan alkuperäinen ruudukko
  
    if (direction === "left") {
      for (let i = 0; i < 4; i++) {
        newGrid[i] = slide(newGrid[i]);
      }
    } else if (direction === "right") {
      for (let i = 0; i < 4; i++) {
        newGrid[i] = slide(newGrid[i].reverse()).reverse();
      }
    } else if (direction === "up") {
      for (let i = 0; i < 4; i++) {
        let col = newGrid.map((row) => row[i]);
        let newCol = slide(col);
        newCol.forEach((val, j) => (newGrid[j][i] = val));
      }
    } else if (direction === "down") {
      for (let i = 0; i < 4; i++) {
        let col = newGrid.map((row) => row[i]).reverse();
        let newCol = slide(col).reverse();
        newCol.forEach((val, j) => (newGrid[j][i] = val));
      }
    }
  
    // Tarkistetaan, muuttuiko ruudukko ennen uuden laatan lisäämistä
    if (JSON.stringify(newGrid) !== originalGrid) {
      addRandomTile(newGrid); // Lisätään vain yksi laatta, jos siirto muutti ruudukkoa
    }
  
    return newGrid;
  };
  
  export const checkGameOver = (grid) => {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (grid[i][j] === 0) return false;
        if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
        if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
      }
    }
    return true;
  };
  