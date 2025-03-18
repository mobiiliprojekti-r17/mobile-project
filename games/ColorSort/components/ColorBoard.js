import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";

const COLORS = [
    { id: "1", color: "red" },
    { id: "2", color: "blue" },
    { id: "3", color: "green" },
    { id: "4", color: "yellow" },
];

const ColorBoard = () => {
    const [data, setData] = useState(shuffleArray([...COLORS]));
    
    const swapItems = (index1, index2) => {
        let newData = [...data];
        [newData[index1], newData[index2]] = [newData[index2], newData[index1]];
        setData(newData);
    };
    
    const checkWin = () => {
        return JSON.stringify(data) === JSON.stringify(COLORS);
    };
    
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Sort the Colors!</Text>
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
            <TouchableOpacity
                style={[styles.box, { backgroundColor: item.color }]}
                onPress={() => index > 0 && swapItems(index, index - 1)}
            />
            )}
        />
        {checkWin() && <Text style={styles.winText}>You Won!</Text>}
        </View>
    );
    };
    
    const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
    };      

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "pink",
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
    },
    box: {
      width: 100,
      height: 50,
      marginVertical: 5,
      borderRadius: 5,
    },
    winText: {
      marginTop: 20,
      fontSize: 18,
      color: "green",
    },
});

export default ColorBoard;
