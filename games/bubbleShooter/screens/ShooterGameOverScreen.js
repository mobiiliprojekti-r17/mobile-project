import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from 'react';
import { db } from "../../../firebase/Config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

const ShooterGameOver = ({ navigation, route }) => {
  const { finalScore = 0, nickname } = route.params || {};
  const [results, setResults] = useState([]);

  useEffect(() => {
      const fetchResults = async () => {
        try {
          const resultsQuery = query(
            collection(db, "ShooterResults"),
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={{ fontSize: 18 }}>Käyttäjä: {nickname}</Text>
      <Text style={styles.score}>Pisteet: {finalScore}</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Play Again"
          onPress={() => navigation.replace('BubbleShooter')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Back to Menu"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
      <Text style={{ fontSize: 18, marginTop: 20 }}>Top list:</Text>
            <ScrollView style={{ width: "90%" }}>
        {results.length > 0 ? (
          results.map((result, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text>User: {result.Nickname}</Text>
              <Text>Score: {result.score}</Text>
            </View>
          ))
        ) : (
          <Text>No scores yet!</Text>
        )}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    color: '#fff',
    marginBottom: 40,
  },
  buttonContainer: {
    marginVertical: 10,
    width: 200,
  },
  score: {
    color: '#fff'
  },
});

export default ShooterGameOver;