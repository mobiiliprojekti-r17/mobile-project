import React, { useEffect, useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { db } from "../../../firebase/Config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import shooterGoStyles from '../styles/shooterGoStyles';

const ShooterGameOver = ({ navigation, route }) => {
  const { finalScore = 0, nickname } = route.params || {};
  const [results, setResults] = useState([]);
  const [ranking, setRanking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Animaatio
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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

        const index = resultsList.findIndex(
          (res) => res.Nickname === nickname && res.score === finalScore
        );
        if (index !== -1) {
          setRanking(index + 1);
        }
      } catch (error) {
        console.error("Virhe tulosten hakemisessa: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  const renderTopListItem = (result, index) => (
    <View key={index} style={shooterGoStyles.topListItem}>
      <Text style={shooterGoStyles.topListName}>
        {index + 1}. {result.Nickname}
      </Text>
      <Text style={shooterGoStyles.topListScore}>Score: {result.score}</Text>
    </View>
  );

  return (
    <View style={shooterGoStyles.gameOverContainer}>
      <Animated.Text
        style={[
          shooterGoStyles.gameOverTitle,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
      >
        Game Over
      </Animated.Text>

      <Text style={shooterGoStyles.gameOverText}>User: {nickname}</Text>
      <Text style={shooterGoStyles.gameOverScore}>Score: {finalScore}</Text>

      {ranking !== null && (
        <Text style={shooterGoStyles.gameOverRank}>Ranking: {ranking}.</Text>
      )}

      <TouchableOpacity
        style={shooterGoStyles.gameOverButtonContainer}
        onPress={() => navigation.replace('BubbleShooter')}
      >
        <Text style={shooterGoStyles.gameOverButtonText}>Play Again</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={shooterGoStyles.gameOverButtonContainer}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={shooterGoStyles.gameOverButtonText}>Back to Menu</Text>
      </TouchableOpacity>

      <Text style={shooterGoStyles.topListTitle}>Top List</Text>

      <ScrollView style={shooterGoStyles.topListContainer}>
        {loading ? (
          <Text style={shooterGoStyles.topListScore}>Loading scores...</Text>
        ) : results.length > 0 ? (
          results.map(renderTopListItem)
        ) : (
          <Text style={shooterGoStyles.topListScore}>No scores yet!</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ShooterGameOver;
