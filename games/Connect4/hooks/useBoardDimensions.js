import { Dimensions } from 'react-native';

// Hook laskee pelilaudan ja solu­l­okeroiden mitat näytön leveyden mukaan
export const useBoardDimensions = (cols = 7) => {
  // Näytön leveys pikseleinä
  const screenWidth = Dimensions.get('window').width;
  // Pelilaudan sisennys vasemmalle ja oikealle
  const BOARD_PADDING = 10;
  // Solujen välinen marginaali
  const CELL_MARGIN = 5;
  // Leveys, joka jää jäljelle, kun padding on vähennetty
  const availableWidth = screenWidth - (2 * BOARD_PADDING);
  // Yhden solun koko: jaetaan käytettävissä oleva leveys sarakkeiden määrällä,
  // vähennetään solujen omat marginaalit
  const CELL_SIZE = (availableWidth / cols) - (2 * CELL_MARGIN);
  // Kokonaisleveys, joka kuhunkin soluun varataan marginaalien kanssa
  const TOTAL_CELL_WIDTH = CELL_SIZE + (2 * CELL_MARGIN);
  // Pieni korjaus vaakasiirtoon, jotta kiekot kohdistuvat tarkalleen soluihin
  const X_OFFSET_CORRECTION = -12;

  return { BOARD_PADDING, CELL_MARGIN, availableWidth, CELL_SIZE, TOTAL_CELL_WIDTH, X_OFFSET_CORRECTION };
};
