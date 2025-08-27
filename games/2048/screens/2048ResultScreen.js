// Tuodaan tarvittavat kirjastot ja komponentit
import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView, TouchableOpacity } from "react-native";
import { db } from "../../../firebase/Config"; 
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import styles from "../styles/2048ResultStyles"; 
import { useFonts } from 'expo-font';
import { ChangaOne_400Regular } from '@expo-google-fonts/changa-one';
import { useNickname } from "../../../context/context";

// Pääkomponentti, joka näyttää pelin tulosnäkymän
export default function Game2048ResultScreen({ route, navigation }) {
  const { nickname } = useNickname();
  const { score, time } = route.params;
  const [scores, setScores] = useState([]);

  // Ladataan fontti
  let[fontsLoaded] = useFonts({
    ChangaOne_400Regular,
  });

  // Muuntaa ajan muotoon (mm:ss)
  const convertTimeToSeconds = (timeString) => {
    if (typeof timeString === "string") {
      const timeParts = timeString.split(":" ).map(Number);
      if (timeParts.length === 2) {
        return timeParts[0] * 60 + timeParts[1];
      }
    }
    return 0;
  };

  // Lasketaan annetun ajan sekunnit
  const timeInSeconds = convertTimeToSeconds(time);


  // Parhaiden tulosten haku
  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresQuery = query(collection(db, "2048Results")); // Firestore-kysely tuloksiin
        const querySnapshot = await getDocs(scoresQuery); // Haetaan dokumentit

        // Käydään dokumentit läpi ja muunnetaan aika sekunneiksi
        const scoresList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          if (data.time) {
            const timeParts = data.time.split(":" ).map(Number);
            data.timeInSeconds = (timeParts[0] || 0) * 60 + (timeParts[1] || 0);
          } else {
            data.timeInSeconds = 0;
          }
          return data;
        });

        // Järjestetään tulokset: ensin pisteet, sitten aika
        scoresList.sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          return a.timeInSeconds - b.timeInSeconds;
        });

        // Näytetään vain top 10 tulosta
        setScores(scoresList.slice(0, 10));
      } catch (error) {
        console.error("Virhe tulosten hakemisessa: ", error);
      }
    };

    fetchScores();
  }, [navigation]); // Päivitetään, jos navigointi muuttuu

  // Muotoilee sekuntimuotoisen ajan mm:ss-muotoon
  const formattedTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const secs = timeInSeconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Näytetään latausteksti, jos fontti ei ole vielä ladattu
  if (!fontsLoaded) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Otsikko fontilla */}
      <Text style={[styles.ChangaOneText, {fontFamily: 'ChangaOne_400Regular'}]}>Game Over!</Text>
      
      {/* Äskeisen pelaajan tulokset */}
      <View style={styles.resultBox}>
        <Text style={styles.infoText}>Player: {nickname}</Text>
        <Text style={styles.infoText}>Score: {score}</Text>
        <Text style={styles.infoText}>Time: {formattedTime(timeInSeconds)}</Text>
      </View>

      {/* Top 10 -otsikko */}
      <Text style={styles.subtitle}>Top 10:</Text>
      
      {/* Lista parhaista tuloksista */}
      <ScrollView style={styles.scrollView}>
        {scores.length > 0 ? (
         scores.map((score, index) => (
          <View key={index} style={styles.scoreItem}>  
          {/* Sijoitus */}
            <View style={styles.rankContainer}>
            <Text style={styles.rank}>#{index + 1}</Text>
           </View>

          {/* Pelaajan nimi, pisteet ja aika*/}
          <View style={styles.textContainer}>
            <Text style={styles.scoreText}>Player: {score.Nickname}</Text>
            <Text style={styles.scoreText}>Score: {score.score}</Text>
            <Text style={styles.scoreText}>Time: {formattedTime(score.timeInSeconds)}</Text>
          </View>
        </View>
    ))
      ) : (
        <Text style={styles.noScores}>No scores yet!</Text>
      )}
      </ScrollView>

      {/* Napit pelin uudelleen pelaamiseen ja kotiin siirtymiseen */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.playAgainButton} onPress={() => navigation.navigate("2048")}>
          <Text style={styles.homeButtonText}>Play Again</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.homeButton} onPress={() => navigation.navigate("Home")}>
          <Text style={styles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
);
}