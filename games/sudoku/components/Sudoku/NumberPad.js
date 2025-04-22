import React from "react";  
import { View, TouchableOpacity, Text } from "react-native"; 
import { Button } from "react-native-paper";  
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; 
import styles from "../../styles/SudokuStyles";  

export default function NumberPad({ board, onNumberPress, onClear, onCheck, onToggleNote, noteMode, onShowInfo }) {
  return (
    <View style={styles.numberPadBox}> 
      <View style={styles.numberPad}> 
        {/* Luodaan napit numeroille 1–9 ja laitetaan numero harmaaksi jos kaikki on laitettu ruutuihin */}
        {Array.from({ length: 9 }, (_, i) => i + 1).map(n => {
          const usedCount = board
            .flat()
            .filter(c => c.value === String(n)).length;
          return (
            <Button
              key={n}
              mode="contained"
              disabled={usedCount >= 9}        // Estetään, kun kaikki saman numeron solut on täytetty
              style={[
                styles.numberButton,
                usedCount >= 9 && styles.numberButtonDisabled
              ]}
              labelStyle={styles.numberButtonText}
              onPress={() => onNumberPress(n)} // Syötetään numero soluun
            >
              {n}
            </Button>
          );
        })}

        {/* delete nappi */}
        <Button style={styles.clearButton} onPress={onClear}>
          <MaterialCommunityIcons name="delete" size={22} color={'black'} />
        </Button>

        {/* sudokun tarkistus */}
        <Button style={styles.CheckButton} onPress={onCheck}>
          <Text style={styles.CheckButtonText}>Check sudoku</Text>
        </Button>

        {/* pelin ohjeet  -modaali*/}
        <TouchableOpacity style={styles.InfoButton} onPress={onShowInfo}>
          <MaterialCommunityIcons name="information" size={24} />
        </TouchableOpacity>

        {/* Vaihda muistiinpanotilan ja arvojen välillä */}
        <Button
          mode={noteMode ? "contained" : "outlined"}
          style={[styles.ModeButton, noteMode && styles.ModeButtonActive]}
          labelStyle={
            noteMode
              ? styles.ModeButtonTextActive
              : styles.ModeButtonText
          }
          onPress={onToggleNote}
        >
          {noteMode ? "Notes mode" : "Value mode"}
        </Button>
      </View>
    </View>
  );
}
