import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { db } from "../../../firebase/Config"; 
import { collection, getDocs, query, orderBy } from "firebase/firestore"; 

export default function Game2048ResultScreen({ route, navigation }) {
  const { Nickname,score, time } = route.params;
  const [scores, setScores] = useState([]);


  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresQuery = query(
          collection(db, "Game2048Results"),
          orderBy("score", "desc")
        );
        
        const querySnapshot = await getDocs(scoresQuery);
        const scoresList = querySnapshot.docs.map((doc) => {
          const data = doc.data();

          if (data.time) {
            const timeParts = data.time.split(":");
            data.timeInSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]); 
          } else {
            data.timeInSeconds = 0;
          }

          return data;
        });
        setScores(scoresList);
      } catch (error) {
        console.error("Virhe tulosten hakemisessa: ", error);
      }
    };

    fetchScores();
  }, [navigation]);

  const formattedTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const secs = timeInSeconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Game Over!</Text>
      <Text style={{ fontSize: 18 }}>Player: {Nickname}</Text>
      <Text style={{ fontSize: 18 }}>Score: {score}</Text>
      <Text style={{ fontSize: 18 }}>Time: {formattedTime(time)}</Text>

      <Text style={{ fontSize: 18, marginTop: 20 }}>Top Scores:</Text>
      <ScrollView>
        {scores.length > 0 ? (
          scores.map((score, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text>Player: {score.Nickname}</Text>
              <Text>Score: {score.score}</Text>
              <Text>Time: {formattedTime(score.timeInSeconds)}</Text>
            </View>
          ))
        ) : (
          <Text>No scores yet!</Text>
        )}
      </ScrollView>

      <Button title="Home" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}
