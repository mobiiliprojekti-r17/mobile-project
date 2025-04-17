import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from "react-native";
import { db } from "../../../firebase/Config";
import {
  collection,
  getDocs,
  query,
  orderBy
} from "firebase/firestore";
import { useNickname } from "../../../context/context";
import styles from "../styles/ResultsStyles";

export default function ColorSortResultScreen({ route, navigation }) {
  const { nickname } = useNickname();
  const { moves, time } = route.params;
  const [results, setResults] = useState([]);

  const formatTime = totalSeconds => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const q = query(
          collection(db, "ColorSortResults"),
          orderBy("moves", "asc"),
        );
        const snap = await getDocs(q);
        const list = snap.docs.map(d => {
          const r = d.data();
          return {
            ...r,
            // varmistetaan numerotyypit
            moves: Number(r.moves) || 0,
            time:  Number(r.time)  || 0
          };
        });
        setResults(list);
      } catch (e) {
        console.error("Virhe haettaessa tuloksia:", e);
      }
    };

    fetchResults();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Game Over!</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Player: {nickname}</Text>
          <Text style={styles.resultText}>Moves: {moves}</Text>
          <Text style={styles.resultText}>Time: {formatTime(time)}</Text>
        </View>
        <Text style={styles.topListTitle}>Top list:</Text>
        <ScrollView style={styles.scrollView}>
          {results.length > 0 ? (
            results.map((r, i) => (
              <View key={i} style={styles.resultItem}>
                <Text style={styles.resultItemText}>Player: {r.nickname}</Text>
                <Text style={styles.resultItemText}>Moves: {r.moves}</Text>
                <Text style={styles.resultItemText}>
                  Time: {formatTime(r.time)}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.resultText}>No scores yet!</Text>
          )}
        </ScrollView>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
