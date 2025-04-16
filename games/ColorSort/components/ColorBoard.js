import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Button } from 'react-native';

const LEVEL_CONFIGS = [
  { numColors: 4, layersPerBottle: 4, emptyBottles: 2 },  // Taso 1
  { numColors: 5, layersPerBottle: 4, emptyBottles: 2 },  // Taso 2
  { numColors: 6, layersPerBottle: 5, emptyBottles: 3 },  // Taso 3
];

export default function ColorSortGame() {
  // Aloitetaan tasosta 0 (Taso 1)
  const [level, setLevel] = useState(0);
  const [bottles, setBottles] = useState([]);
  const [selectedBottle, setSelectedBottle] = useState(null);
  const [lastMove, setLastMove] = useState(null); // Undo-toimintoa varten

  // Ladataan tason asetukset ja generoidaan pullojen sisältö
  useEffect(() => {
    const config = LEVEL_CONFIGS[level];
    setBottles(generateRandomBottles(config));
  }, [level]);

  const handleBottlePress = (index) => {
    if (selectedBottle === null) {
      if (bottles[index].length === 0) return;
      setSelectedBottle(index);
    } else {
      if (index === selectedBottle) {
        setSelectedBottle(null);
        return;
      }
      pour(selectedBottle, index);
      setSelectedBottle(null);
    }
  };

  const pour = (from, to) => {
    const fromBottle = [...bottles[from]];
    const toBottle = [...bottles[to]];
    
    if (toBottle.length >= LEVEL_CONFIGS[level].layersPerBottle) return;
    const colorToPour = fromBottle[fromBottle.length - 1];
    if (toBottle.length > 0 && toBottle[toBottle.length - 1] !== colorToPour) {
      return;
    }
    
    // Tallenna nykyinen tila ennen siirtoa undo-toimintoa varten
    setLastMove(bottles.map(bottle => [...bottle]));
    
    let amount = 0;
    while (
      fromBottle.length &&
      fromBottle[fromBottle.length - 1] === colorToPour &&
      toBottle.length + amount < LEVEL_CONFIGS[level].layersPerBottle
    ) {
      fromBottle.pop();
      amount++;
    }
    
    for (let i = 0; i < amount; i++) {
      toBottle.push(colorToPour);
    }
    
    const newBottles = [...bottles];
    newBottles[from] = fromBottle;
    newBottles[to] = toBottle;
    
    setBottles(newBottles);
    checkWin(newBottles);
  };

  const handleUndo = () => {
    if (lastMove) {
      setBottles(lastMove);
      setLastMove(null);
    }
  };

  const checkWin = (bottles) => {
    const config = LEVEL_CONFIGS[level];
    const isWin = bottles.every(
      (b) => b.length === 0 || (new Set(b).size === 1 && b.length === config.layersPerBottle)
    );
    if (isWin) {
      Alert.alert('🎉 You win!', `Level ${level + 1} completed!`, [
        { text: 'Next Level', onPress: () => setLevel(prev => Math.min(prev + 1, LEVEL_CONFIGS.length - 1)) }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💧 Water Sort Puzzle - Level {level + 1}</Text>
      
      {/* Undo-nappi */}
      <Button 
        title="Undo"
        onPress={handleUndo}
        disabled={!lastMove}
      />
      
      <View style={styles.bottleContainer}>
        {bottles.map((bottle, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleBottlePress(index)}
            style={styles.bottleWrapper}
          >
            <View style={styles.bottleInner}>
              {Array.from({ length: LEVEL_CONFIGS[level].layersPerBottle }).map((_, i) => {
                const color = bottle[LEVEL_CONFIGS[level].layersPerBottle - 1 - i];
                return (
                  <View
                    key={i}
                    style={[
                      styles.layer,
                      { backgroundColor: color || 'lightgray' },
                    ]}
                  />
                );
              })}
            </View>
            <View 
              style={[
                styles.bottleBorder,
                selectedBottle === index && { borderColor: 'gold', borderWidth: 3 },
              ]}
              pointerEvents="none"
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: 20,
    backgroundColor:'#B09AFF'
  },
  title: {
    fontSize: 24, 
    marginBottom: 20 
  },
  bottleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    backgroundColor:'transparent'
  },
  bottleWrapper: {
    width: 70,
    height: 160,
    margin: 10,
    position: 'relative',
  },
  bottleInner: {
    flex: 1,
    backgroundColor: '#B09AFF',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    overflow: 'hidden',
  },
  bottleBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: '#000',
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  layer: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#aaa',
  },
});
