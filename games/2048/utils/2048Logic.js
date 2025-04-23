// Uuden 4x4 ruudukon luonti ja kahden aloituslaatan lisäys
export const initializeGrid = () => {
  let grid = Array(4)
    .fill()
    .map(() => Array(4).fill(0)); // 4x4 ruudukko, kaikki nollia

  addSpecificTile(grid, 2);
  addSpecificTile(grid, 2); // Lisää kaksi 2-laattaa satunnaisiin kohtiin

  return grid;
};

// Laattojen yhdistyessä lisää satunnaisesti joko 2- tai 4-laatan tyhjään ruutuun
const addSingleTile = (grid) => {
  let emptyTiles = [];
  grid.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === 0) emptyTiles.push({ i, j }); // Etsi tyhjät ruudut
    });
  });

  if (emptyTiles.length > 0) {
    let { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    grid[i][j] = Math.random() > 0.1 ? 2 : 4; // 90 % todennäköisyys 2-laatalla
    return { i, j };
  }
  return null;
};

// Lisää tietty arvo satunnaiseen tyhjään ruutuun
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

// Siirtää ja yhdistää yhden rivin numerot (vasemmalle)
const slide = (row) => {
  let newRow = row.filter((num) => num !== 0); // Poistaa nollat
  let result = [];
  let skipNext = false;
  let pointsEarned = 0;
  let mergedIndexes = [];

  for (let i = 0; i < newRow.length; i++) {
    if (skipNext) {
      skipNext = false;
      continue;
    }

    if (i < newRow.length - 1 && newRow[i] === newRow[i + 1]) {
      let mergedValue = newRow[i] * 2;
      result.push(mergedValue);
      pointsEarned += mergedValue;
      mergedIndexes.push(result.length - 1); // Tallennetaan yhdistetyn indeksin paikka
      skipNext = true;
    } else {
      result.push(newRow[i]);
    }
  }

  while (result.length < 4) {
    result.push(0); // Täydennetään tyhjät paikat nollilla
  }

  return { newRow: result, pointsEarned, mergedIndexes };
};

// Hoitaa laatojen liikuttamisen ja yhdistämisen valittuun suuntaan
export const moveTiles = (grid, direction) => {
  let newGrid = grid.map((row) => [...row]); // Kopioi ruudukko
  let originalGrid = JSON.stringify(grid); // Tarkistaa myöhemmin onko ruudukko muuttunut
  let totalPoints = 0;
  let mergedTiles = [];

  const handleMerge = (i, j) => {
    mergedTiles.push({ i, j });
  };

  if (direction === "left") {
    for (let i = 0; i < 4; i++) {
      let { newRow, pointsEarned, mergedIndexes } = slide(newGrid[i]);
      newGrid[i] = newRow;
      mergedIndexes.forEach((j) => handleMerge(i, j));
      totalPoints += pointsEarned;
    }
  } else if (direction === "right") {
    for (let i = 0; i < 4; i++) {
      let reversed = [...newGrid[i]].reverse();
      let { newRow, pointsEarned, mergedIndexes } = slide(reversed);
      newGrid[i] = newRow.reverse();
      mergedIndexes.forEach((j) => handleMerge(i, 3 - j));
      totalPoints += pointsEarned;
    }
  } else if (direction === "up") {
    for (let i = 0; i < 4; i++) {
      let col = newGrid.map((row) => row[i]);
      let { newRow, pointsEarned, mergedIndexes } = slide(col);
      newRow.forEach((val, j) => {
        newGrid[j][i] = val;
        if (mergedIndexes.includes(j)) handleMerge(j, i);
      });
      totalPoints += pointsEarned;
    }
  } else if (direction === "down") {
    for (let i = 0; i < 4; i++) {
      let col = newGrid.map((row) => row[i]).reverse();
      let { newRow, pointsEarned, mergedIndexes } = slide(col);
      newRow.reverse().forEach((val, j) => {
        newGrid[j][i] = val;
        if (mergedIndexes.includes(3 - j)) handleMerge(j, i);
      });
      totalPoints += pointsEarned;
    }
  }

  // Jos ruudukko muuttui, lisätään uusi laatta
  if (JSON.stringify(newGrid) !== originalGrid) {
    const newTile = addSingleTile(newGrid);
    return { newGrid, totalPoints, newTile, mergedTiles };
  }

  return { newGrid, totalPoints, newTile: null, mergedTiles: [] };
};

// Tarkistaa onko peli ohi (ei tyhjiä eikä mahdollisia yhdistämisiä)
export const checkGameOver = (grid) => {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (grid[i][j] === 0) return false; // Tyhjä ruutu = peli ei ole ohi
      if (j < 3 && grid[i][j] === grid[i][j + 1]) return false;
      if (i < 3 && grid[i][j] === grid[i + 1][j]) return false;
    }
  }
  return true;
};
