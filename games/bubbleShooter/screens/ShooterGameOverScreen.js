import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { db } from "../../../firebase/Config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import shooterGoStyles from '../styles/shooterGoStyles';

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
  }, []);

  return (
    <View style={shooterGoStyles.gameOverContainer}>
      <Text style={shooterGoStyles.gameOverTitle}>Game Over</Text>
      <Text style={shooterGoStyles.gameOverText}>Käyttäjä: {nickname}</Text>
      <Text style={shooterGoStyles.gameOverScore}>Pisteet: {finalScore}</Text>

      <TouchableOpacity
        style={shooterGoStyles.gameOverButtonContainer}
        onPress={() => navigation.replace('BubbleShooter')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Play Again</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={shooterGoStyles.gameOverButtonContainer}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Back to Menu</Text>
      </TouchableOpacity>

      <Text style={shooterGoStyles.topListTitle}>Top List</Text>

      <ScrollView style={shooterGoStyles.topListContainer}>
        {results.length > 0 ? (
          results.map((result, index) => (
            <View key={index} style={shooterGoStyles.topListItem}>
              <Text style={shooterGoStyles.topListName}>
                {index + 1}. {result.Nickname}
              </Text>
              <Text style={shooterGoStyles.topListScore}>Score: {result.score}</Text>
            </View>
          ))
        ) : (
          <Text style={shooterGoStyles.topListScore}>No scores yet!</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ShooterGameOver;
