import { Dimensions } from 'react-native';

export const useBoardDimensions = (cols = 7) => {
  const screenWidth = Dimensions.get('window').width;
  const BOARD_PADDING = 10;
  const CELL_MARGIN = 5;
  const availableWidth = screenWidth - (2 * BOARD_PADDING);
  const CELL_SIZE = availableWidth / cols - 2 * CELL_MARGIN;
  const TOTAL_CELL_WIDTH = CELL_SIZE + 2 * CELL_MARGIN;
  const X_OFFSET_CORRECTION = -12;
  return { BOARD_PADDING, CELL_MARGIN, availableWidth, CELL_SIZE, TOTAL_CELL_WIDTH, X_OFFSET_CORRECTION };
};
