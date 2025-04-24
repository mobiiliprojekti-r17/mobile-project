// Tuodaan React-, React Native- ja Firebase-kirjastot sekä omat kontekstit ja tyylit
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { db } from "../../../firebase/Config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNickname } from "../../../context/context";
import styles from "../styles/BrickResultScreenStyles";

// BreakerResult-komponentti: näyttää pelitulosnäytön ja top-listauksen
export default function BreakerResult({ route, navigation }) {
  const { nickname } = useNickname(); // Haetaan käyttäjän nimi kontekstista
  const { level, score } = route.params; // Reitin parametrit: saavutettu taso ja pistemäärä
  const [results, setResults] = useState([]); // Tilassa säilytetään haetut tulokset

  // useEffect: haetaan top-lista Firestoresta komponentin kiinnittyessä
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Määritellään kysely: 'BreakerResults' -kokoelma, järjestetty pisteiden mukaan laskevasti
        const resultsQuery = query(
          collection(db, "BreakerResults"),
          orderBy("score", "desc")
        );

        // Suoritetaan kysely ja muokataan Snapshot dataksi
        const querySnapshot = await getDocs(resultsQuery);
        const resultsList = querySnapshot.docs.map((doc) => doc.data());
        setResults(resultsList); // Tallennetaan tilaan
      } catch (error) {
        console.error("Virhe tulosten hakemisessa: ", error);
      }
    };

    fetchResults(); // Kutsutaan hakufunktiota
  }, [navigation]); // Riippuvuus navigation, niin päivittää kun navigaatio muuttuu

  // useEffect: estetään paluu takaisin (headerLeft=null ja pyyhkäisy pois käytöstä)
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Näyttö, joka siirtää tekstiä näppäimistön alta iOS:lla */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Otsikko pelin päättymisestä */}
        <Text style={styles.title}>Game Over!</Text>

        {/* Nykyisen pelaajan tulostiedot */}
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Player: {nickname}</Text>
          <Text style={styles.resultText}>Level: {level}</Text>
          <Text style={styles.resultText}>Score: {score}</Text>
        </View>

        {/* Top-listauksen otsikko */}
        <Text style={styles.topListTitle}>Top list:</Text>

        {/* Vieritettävä lista top-tuloksista */}
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
            // Jos tuloksia ei vielä ole
            <Text style={styles.resultText}>No scores yet!</Text>
          )}
        </ScrollView>

        {/* Kotinäytölle palaava nappi */}
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
