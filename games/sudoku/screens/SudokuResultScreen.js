import React, { useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { db } from "../../../firebase/Config"; 
import { collection, getDocs, query, orderBy } from "firebase/firestore"; 

export default function SudokuResult({ route, navigation }) {
  const { time, difficulty, Nickname } = route.params;
  const [scores, setScores] = useState([]); 

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const scoresQuery = query(
          collection(db, "SudokuGameResults"),
          orderBy("time")
        );
        
        
        const querySnapshot = await getDocs(scoresQuery);
        const scoresList = querySnapshot.docs.map((doc) => {
          const data = doc.data();
  
          if (data.time) {
            const timeParts = data.time.split(":");
            data.timeInSeconds = parseInt(timeParts[0]) * 60 + parseInt(timeParts[1]); // Laskee sekunnit
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
  
  // Muotoillaan aika takaisin "mm:ss"-muotoon
  const formattedTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const secs = timeInSeconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>GAME OVER!</Text>
      <Text style={{ fontSize: 18 }}>Nickname: {Nickname}</Text>
      <Text style={{ fontSize: 18 }}>Difficulty: {difficulty}</Text>
      <Text style={{ fontSize: 18 }}>Time: {formattedTime(time)}</Text>

      {/* Tulokset-lista */}
      <Text style={{ fontSize: 18 }}>Top list:</Text>
      <ScrollView>
        {scores.length > 0 ? (
          scores.map((score, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text>Nickname: {score.Nickname}</Text>
              <Text>Difficulty: {score.difficulty}</Text>
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
