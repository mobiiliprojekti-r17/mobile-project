import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from "../../../firebase/Config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNickname } from "../../../context/context";
import styles from "../styles/ResultsStyles";
import { useFonts, ConcertOne_400Regular } from '@expo-google-fonts/concert-one';

export default function ColorSortResultScreen({ route, navigation }) {
  const [fontsLoaded] = useFonts({
    ConcertOne_400Regular,
  });
  const { nickname } = useNickname();
  const { moves, time } = route.params;

  const [results, setResults] = useState([]);
  const [ownRank, setOwnRank] = useState(0);

  // Helper to format seconds into M:SS
  const formatTime = totalSeconds => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };
  const formattedOwnTime = formatTime(time);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const q = query(
          collection(db, "ColorSortResults"),
          orderBy("moves", "asc")
        );
        const snap = await getDocs(q);

        const fullList = snap.docs
          .map(d => {
            const r = d.data();
            // Only process documents with a valid time string
            if (!r.time || typeof r.time !== 'string') {
              return null;
            }
            const [min, sec] = r.time.split(':').map(Number);
            const timeSeconds = min * 60 + sec;
            return {
              nickname: r.nickname,
              moves: Number(r.moves) || 0,
              time: r.time,
              timeSeconds,
            };
          })
          .filter(item => item !== null);

        // Sort by moves, then timeSeconds
        fullList.sort((a, b) => {
          if (a.moves !== b.moves) {
            return a.moves - b.moves;
          }
          return a.timeSeconds - b.timeSeconds;
        });

        // Determine own rank
        const rank = fullList.findIndex(
          r =>
            r.nickname === nickname &&
            r.moves === moves &&
            r.time === formattedOwnTime
        ) + 1;
        setOwnRank(rank > 0 ? rank : fullList.length + 1);

        // Take top 10 for display
        setResults(fullList.slice(0, 10));
      } catch (e) {
        console.error("Virhe haettaessa tuloksia:", e);
      }
    };

    fetchAll();
  }, [nickname, moves, formattedOwnTime]);

  const restart = () => {
    navigation.replace("ColorGame");
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Your result!</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Nickname: {nickname}</Text>
          <Text style={styles.resultText}>Moves: {moves}</Text>
          <Text style={styles.resultText}>Time: {formattedOwnTime}</Text>
          <Text style={styles.resultText}>Ranking: #{ownRank}</Text>
        </View>
        <View style={styles.ButtonsContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.homeButton}>
            <MaterialCommunityIcons name="home" size={25} color="#fff" />
            <Text style={styles.homeButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={restart} style={styles.PlayAgainButton}>
            <MaterialCommunityIcons name="restart" size={25} color="#fff" />
            <Text style={styles.PlayAgainButtonText}>Restart</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.topListTitle}>Top 10 list:</Text>
        <View style={styles.TopresultBox}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {results.length > 0 ? (
            results.map((r, i) => (
              <View key={i} style={styles.resultItem}>
                <Text style={styles.rank}>#{i + 1}</Text>
                <Text style={styles.resultItemText}>Nickname: {r.nickname}</Text>
                <Text style={styles.resultItemText}>Moves: {r.moves}</Text>
                <Text style={styles.resultItemText}>Time: {r.time}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.NoresultText}>No scores yet!</Text>
          )}
        </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
