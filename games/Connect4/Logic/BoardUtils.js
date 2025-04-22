export const getLandingRowAndToY = (board, totalCellWidth, col) => {
  // Etsitään ylhäältä alas ensimmäinen tyhjä kohta annetussa sarakkeessa
  // reverseIndex on etäisyys laudasta alhaalta päin
  const reverseIndex = board
    .slice() 
    .reverse()  
    .findIndex(row => row[col] === null);

  // Jos sarakkeessa ei ole tyhjää kohtaa, palataan nullilla
  if (reverseIndex === -1) return null;

  // Lasketaan rivin numero alkuperäisestä laudasta päin
  const landingRow = board.length - 1 - reverseIndex;

  // Muutetaan rivin indeksi pikseleiksi animoitavaa Y‑koordinaattia varten
  const toY = landingRow * totalCellWidth;

  // Palautetaan sekä riveyden indeksi että Y‑koordinaatti
  return { landingRow, toY };
};
