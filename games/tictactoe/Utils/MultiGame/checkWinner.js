// Tarkistaa, onko jollain jommalla kummalla pelaajista voittorivi laudalla
export const checkWinner = board => {
  // Määritellään kaikki mahdolliset voittorivit (3 vaakaa, 3 pystyä, 2 vinoriviä)
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],   // vaakarivit
    [0,3,6], [1,4,7], [2,5,8],   // pystyrivit
    [0,4,8], [2,4,6]             // vinorivit
  ];

  // Käydään läpi jokainen rivi ja tarkistetaan, ovatko samat merkit ('X' tai 'O')
  for (let [a,b,c] of lines) {
    // Jos kohdissa a, b ja c on sama merkki eikä null, palautetaan merkki ('X' tai 'O')
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  // Jos voittajaa ei ole, palautetaan null
  return null;
};