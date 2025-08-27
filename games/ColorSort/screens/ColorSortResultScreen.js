import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { db } from "../../../firebase/Config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNickname } from "../../../context/context";
import styles from "../styles/ResultsStyles";

export default function ColorSortResultScreen({ route, navigation }) {
  // Haetaan pelaajan nimimerkki kontekstista
  const { nickname } = useNickname();
  // Tuloksen tiedot edelliseltä näytöltä
  const { moves, time } = route.params;

  // Paikallinen tila haetuille tuloksille ja omalle sijoitukselle
  const [results, setResults] = useState([]);
  const [ownRank, setOwnRank] = useState(0);

  // Muuntaa sekunnit muotoon MM:SS
  const formatTime = totalSeconds => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };
  const formattedOwnTime = formatTime(time);

  // Haetaan Firebase‑kokoelman tulokset kerran komponentin renderöinnin jälkeen
  useEffect(() => {
    const fetchAll = async () => {
      try {
        // järjestetään moves:ien mukaan
        const q = query(
          collection(db, "ColorSortResults"),
          orderBy("moves", "asc")
        );
        const snap = await getDocs(q);

        // Muodostetaan lista ja muunnetaan aika sekunneiksi vertailua varten
        const fullList = snap.docs
          .map(d => {
            const r = d.data();
            if (!r.time || typeof r.time !== 'string') return null;
            const [min, sec] = r.time.split(':').map(Number);
            return {
              nickname: r.nickname,
              moves: Number(r.moves) || 0,
              time: r.time,
              timeSeconds: min * 60 + sec,
            };
          })
          .filter(item => item !== null);

        // Järjestetään ensin siirtojen mukaan, jos sama määrä, sitten ajan mukaan
        fullList.sort((a, b) => {
          if (a.moves !== b.moves) return a.moves - b.moves;
          return a.timeSeconds - b.timeSeconds;
        });

        // Lasketaan oma sijoitus listassa
        const rank = fullList.findIndex(
          r =>
            r.nickname === nickname &&
            r.moves === moves &&
            r.time === formattedOwnTime
        ) + 1;
        setOwnRank(rank > 0 ? rank : fullList.length + 1);

        // Näytetään vain top 10
        setResults(fullList.slice(0, 10));
      } catch (e) {
        console.error("Virhe haettaessa tuloksia:", e);
      }
    };

    fetchAll();
  }, [nickname, moves, formattedOwnTime]);

  // Funktio pelin uudelleenaloitukseen ColorGame‑näytölle
  const restart = () => {
    navigation.replace("ColorGame");
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Oma tulos */}
        <Text style={styles.title}>Your result!</Text>
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Nickname: {nickname}</Text>
          <Text style={styles.resultText}>Moves: {moves}</Text>
          <Text style={styles.resultText}>Time: {formattedOwnTime}</Text>
          <Text style={styles.resultText}>Ranking: #{ownRank}</Text>
        </View>

        {/* Toimintonapit: kotinäyttö ja pelaa uudelleen */}
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

        {/* Top 10 ‑lista */}
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
