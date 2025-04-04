import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { db } from "../../../firebase/Config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { useNickname } from "../../../context/context";

export default function BreakerResult({ route, navigation }) {
  const { nickname } = useNickname(); // ← käytetään tästä
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
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Peli päättyi!</Text>
      <Text style={{ fontSize: 18 }}>Käyttäjä: {nickname}</Text>
      <Text style={{ fontSize: 18 }}>Taso: {level}</Text>
      <Text style={{ fontSize: 18 }}>Pisteet: {score}</Text>

      <Text style={{ fontSize: 18, marginTop: 20 }}>Top list:</Text>
      <ScrollView style={{ width: "90%" }}>
        {results.length > 0 ? (
          results.map((result, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text>Käyttäjä: {result.Nickname}</Text>
              <Text>Taso: {result.level}</Text>
              <Text>Pisteet: {result.score}</Text>
            </View>
          ))
        ) : (
          <Text>No scores yet!</Text>
        )}
      </ScrollView>

      <Button title="Palaa päävalikkoon" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}
