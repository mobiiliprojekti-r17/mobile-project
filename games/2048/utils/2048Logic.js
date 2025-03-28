export const initializeGrid = () => {
    let grid = Array(4)
        .fill()
        .map(() => Array(4).fill(0));

    addSpecificTile(grid, 2);
    addSpecificTile(grid, 2);

    return grid;
};

const addSingleTile = (grid) => {
    let emptyTiles = [];
    grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            if (cell === 0) emptyTiles.push({ i, j });
        });
    });

    if (emptyTiles.length > 0) {
        let { i, j } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        grid[i][j] = Math.random() > 0.1 ? 2 : 4;
    }
};

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
    let result = [];
    let skipNext = false;
    let pointsEarned = 0; // Tallennetaan ansaitut pisteet

    for (let i = 0; i < newRow.length; i++) {
        if (skipNext) {
            skipNext = false;
            continue;
        }

        if (i < newRow.length - 1 && newRow[i] === newRow[i + 1]) {
            let mergedValue = newRow[i] * 2;
            result.push(mergedValue);
            pointsEarned += mergedValue; // Lisätään pisteisiin yhdistetyn laatan arvo
            skipNext = true;
        } else {
            result.push(newRow[i]);
        }
    }

    while (result.length < 4) {
        result.push(0);
    }

    return { newRow: result, pointsEarned };
};

export const moveTiles = (grid, direction) => {
    let newGrid = grid.map((row) => [...row]);
    let originalGrid = JSON.stringify(grid);
    let totalPoints = 0;

    if (direction === "left") {
        for (let i = 0; i < 4; i++) {
            let { newRow, pointsEarned } = slide(newGrid[i]);
            newGrid[i] = newRow;
            totalPoints += pointsEarned;
        }
    } else if (direction === "right") {
        for (let i = 0; i < 4; i++) {
            let { newRow, pointsEarned } = slide(newGrid[i].reverse());
            newGrid[i] = newRow.reverse();
            totalPoints += pointsEarned;
        }
    } else if (direction === "up") {
        for (let i = 0; i < 4; i++) {
            let col = newGrid.map((row) => row[i]);
            let { newRow, pointsEarned } = slide(col);
            newRow.forEach((val, j) => (newGrid[j][i] = val));
            totalPoints += pointsEarned;
        }
    } else if (direction === "down") {
        for (let i = 0; i < 4; i++) {
            let col = newGrid.map((row) => row[i]).reverse();
            let { newRow, pointsEarned } = slide(col);
            newRow.reverse().forEach((val, j) => (newGrid[j][i] = val));
            totalPoints += pointsEarned;
        }
    }

    if (JSON.stringify(newGrid) !== originalGrid) {
        addSingleTile(newGrid);
    }

    return { newGrid, totalPoints }; // Palautetaan myös pisteet
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
