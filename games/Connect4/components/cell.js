import React from 'react';
import { TouchableOpacity, View } from 'react-native';

const Cell = ({ row, col, value, isWinningCell, onPress, styles }) => {
  const cellColor =
    value === 'Yellow'
      ? 'rgb(255, 234, 0)'
      : value === 'Orange'
      ? 'rgb(255, 94, 0)'
      : 'transparent';

  const highlightStyle = isWinningCell ? { borderWidth: 3, borderColor: '#fff' } : {};

  return (
    <TouchableOpacity style={styles.cell} onPress={() => onPress(col)}>
      {value && (
        <View
          style={[
            styles.disc,
            { backgroundColor: cellColor },
            highlightStyle,
          ]}
        />
      )}
    </TouchableOpacity>
  );
};

export default Cell;
