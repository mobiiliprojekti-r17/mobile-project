export const getLandingRowAndToY = (board, totalCellWidth, col) => {
    const reverseIndex = board.slice().reverse().findIndex(row => row[col] === null);
    if (reverseIndex === -1) return null;
    const landingRow = board.length - 1 - reverseIndex;
    const toY = landingRow * totalCellWidth;
    return { landingRow, toY };
  };
  