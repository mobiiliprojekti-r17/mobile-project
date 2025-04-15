import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import { db } from "../../../firebase/Config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNickname } from "../../../context/context";
import styles from "../styles/BrickResultScreenStyles";


export default function BreakerResult({ route, navigation }) {
  const { nickname } = useNickname();
  const { level, score } = route.params;
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const resultsQuery = query(
          collection(db, "BreakerResults"),
          orderBy("score", "desc")
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Game Over!</Text>

        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Player: {nickname}</Text>
          <Text style={styles.resultText}>Level: {level}</Text>
          <Text style={styles.resultText}>Score: {score}</Text>
        </View>

        <Text style={styles.topListTitle}>Top list:</Text>

        <ScrollView style={styles.scrollView}>
          {results.length > 0 ? (
            results.map((result, index) => (
              <View key={index} style={styles.resultItem}>
                <Text style={styles.resultItemText}>Player: {result.Nickname}</Text>
                <Text style={styles.resultItemText}>Level: {result.level}</Text>
                <Text style={styles.resultItemText}>Score: {result.score}</Text>
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
