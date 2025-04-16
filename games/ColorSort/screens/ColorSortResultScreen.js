import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { db } from "../../../firebase/Config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNickname } from "../../../context/context";
import styles from "../styles/ResultsStyles";

export default function ColorSortResultScreen({ route, navigation }) {
  const { nickname } = useNickname();
  const { moves, time } = route.params; // time tässä on kokonaisaika sekunteina
  const [results, setResults] = useState([]);

  // Funktio, joka muuntaa sekunnit minuutteina ja sekunteina
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const resultsQuery = query(
          collection(db, "ColorSortResults"),
          orderBy("moves", "desc")
        );

        const querySnapshot = await getDocs(resultsQuery);
        const resultsList = querySnapshot.docs.map((doc) => doc.data());
        setResults(resultsList);
      } catch (error) {
        console.error("Virhe tulosten hakemisessa: ", error);
      }
    };

    fetchResults();
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <Text style={styles.title}>Game Over!</Text>

        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Player: {nickname}</Text>
          <Text style={styles.resultText}>Moves: {moves}</Text>
          <Text style={styles.resultText}>Time: {formatTime(time)}</Text>
        </View>

        <Text style={styles.topListTitle}>Top list:</Text>

        <ScrollView style={styles.scrollView}>
          {results.length > 0 ? (
            results.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <Text style={styles.resultItemText}>Player: {result.nickname}</Text>
                <Text style={styles.resultItemText}>Moves: {result.moves}</Text>
                <Text style={styles.resultItemText}>Time: {formatTime(result.time)}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.resultText}>No scores yet!</Text>
          )}
        </ScrollView>

        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
