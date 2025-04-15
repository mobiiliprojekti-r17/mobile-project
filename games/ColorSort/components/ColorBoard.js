import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

// Configurable settings
const COLORS = ['red', 'blue', 'green', 'yellow'];
const LAYERS_PER_BOTTLE = 4;
const EMPTY_BOTTLES = 2;

function generateRandomBottles() {
  const colorPool = [];

  // Add each color 4 times to the pool
  COLORS.forEach((color) => {
    for (let i = 0; i < LAYERS_PER_BOTTLE; i++) {
      colorPool.push(color);
    }
  });

  // Shuffle colors
  for (let i = colorPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [colorPool[i], colorPool[j]] = [colorPool[j], colorPool[i]];
  }

  // Split into bottles
  const bottles = [];
  const totalFilledBottles = colorPool.length / LAYERS_PER_BOTTLE;
  for (let i = 0; i < totalFilledBottles; i++) {
    bottles.push(colorPool.slice(i * LAYERS_PER_BOTTLE, (i + 1) * LAYERS_PER_BOTTLE));
  }

  // Add empty bottles
  for (let i = 0; i < EMPTY_BOTTLES; i++) {
    bottles.push([]);
  }

  return bottles;
}

export default function ColorSortGame() {
  const [bottles, setBottles] = useState([]);
  const [selectedBottle, setSelectedBottle] = useState(null);

  useEffect(() => {
    setBottles(generateRandomBottles());
  }, []);

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

    if (toBottle.length >= LAYERS_PER_BOTTLE) return;

    const colorToPour = fromBottle[fromBottle.length - 1];
    let amount = 0;

    // Check pour compatibility
    if (
      toBottle.length > 0 &&
      toBottle[toBottle.length - 1] !== colorToPour
    ) {
      return;
    }

    while (
      fromBottle.length &&
      fromBottle[fromBottle.length - 1] === colorToPour &&
      toBottle.length + amount < LAYERS_PER_BOTTLE
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

  const checkWin = (bottles) => {
    const isWin = bottles.every(
      (b) => b.length === 0 || (new Set(b).size === 1 && b.length === LAYERS_PER_BOTTLE)
    );
    if (isWin) {
      Alert.alert('🎉 You win!', 'All bottles sorted!');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💧 Water Sort Puzzle</Text>
      <View style={styles.bottleContainer}>
        {bottles.map((bottle, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.bottle,
              selectedBottle === index && { borderColor: 'gold', borderWidth: 3 },
            ]}
            onPress={() => handleBottlePress(index)}
          >
            {Array.from({ length: LAYERS_PER_BOTTLE }).map((_, i) => {
              const color = bottle[LAYERS_PER_BOTTLE - 1 - i]; // from bottom to top
              return (
                <View
                  key={i}
                  style={[
                    styles.layer,
                    {
                      backgroundColor: color || 'lightgray',
                    },
                  ]}
                />
              );
            })}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  bottleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  bottle: {
    width: 60,
    height: 160,
    borderWidth: 2,
    borderColor: '#000',
    margin: 10,
    justifyContent: 'flex-start',
    backgroundColor: '#ddd',
  },
  layer: {
    height: 40,
    borderBottomWidth: 1,
    borderColor: '#aaa',
  },
});
