import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { Button } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "../../styles/SudokuStyles";

export default function NumberPad({ board, onNumberPress, onClear, onCheck, onToggleNote, noteMode, onShowInfo}) {
  return (
    <View style={styles.numberPadBox}>
      <View style={styles.numberPad}>
        {Array.from({ length: 9 }, (_, i) => i + 1).map(n => {
          const usedCount = board.flat().filter(c => c.value === String(n)).length;
          return (
            <Button
              key={n}
              mode="contained"
              disabled={usedCount >= 9}
              style={[styles.numberButton, usedCount >= 9 && styles.numberButtonDisabled]}
              labelStyle={styles.numberButtonText}
              onPress={() => onNumberPress(n)}
            >
              {n}
            </Button>
          );
        })}
        <Button style={styles.clearButton} onPress={onClear}>
          <MaterialCommunityIcons name="delete" size={22} color={'black'} />
        </Button>
        <Button style={styles.CheckButton} onPress={onCheck}>
          <Text style={styles.CheckButtonText}>Check sudoku</Text>
        </Button>
        <TouchableOpacity style={styles.InfoButton} onPress={onShowInfo}>
          <MaterialCommunityIcons name="information" size={24} />
        </TouchableOpacity>
        <Button
          mode={noteMode ? "contained" : "outlined"}
          style={[styles.ModeButton, noteMode && styles.ModeButtonActive]}
          labelStyle={noteMode ? styles.ModeButtonTextActive : styles.ModeButtonText}
          onPress={onToggleNote}
        >
          {noteMode ? "Notes mode" : "Value mode"}
        </Button>
      </View>
    </View>
  );
}
