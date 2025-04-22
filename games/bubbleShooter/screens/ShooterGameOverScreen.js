import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { db } from "../../../firebase/Config";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import * as Animatable from 'react-native-animatable';
import { LinearGradient } from 'expo-linear-gradient';
import shooterGoStyles from '../styles/shooterGoStyles';

const ShooterGameOver = ({ navigation, route }) => {
  const { finalScore = 0, nickname = "Player" } = route.params || {};
  const [results, setResults] = useState([]);
  const [ranking, setRanking] = useState(null);

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
      }
    };

    fetchResults();
  }, []);

  const renderTopListItem = (result, index) => (
    <Animatable.View animation="fadeInUp" delay={index * 100} key={index} style={shooterGoStyles.topListItem}>
      <Text style={shooterGoStyles.topListName}>
        {index + 1}. {result.Nickname}
      </Text>
      <Text style={shooterGoStyles.topListScore}>Score: {result.score}</Text>
    </Animatable.View>
  );

  return (
    <LinearGradient colors={['rgb(255, 158, 226)', '#fac3e9']} style={shooterGoStyles.gameOverContainer}>
      {/* Sparkle Emojis */}
      <Animatable.Text
        animation="pulse"
        iterationCount="infinite"
        direction="alternate"
        style={{ fontSize: 30, position: 'absolute', top: 40, left: 30 }}
      >
        ✨
      </Animatable.Text>
      <Animatable.Text
        animation="pulse"
        iterationCount="infinite"
        direction="alternate"
        delay={500}
        style={{ fontSize: 26, position: 'absolute', top: 50, right: 50 }}
      >
        🌟
      </Animatable.Text>
      <Animatable.Text
        animation="pulse"
        iterationCount="infinite"
        direction="alternate"
        delay={1000}
        style={{ fontSize: 28, position: 'absolute', top: 200, left: 70 }}
      >
        💖
      </Animatable.Text>

      <Animatable.Text animation="bounceInDown" duration={1500} style={shooterGoStyles.gameOverTitle}>
        🎀 Game Over 🎀
      </Animatable.Text>

      <Animatable.Text animation="fadeIn" delay={500} style={shooterGoStyles.gameOverText}>
        🧸 Nickname: {nickname}
      </Animatable.Text>
      <Animatable.Text animation="fadeIn" delay={700} style={shooterGoStyles.gameOverScore}>
        🎯 Score: {finalScore}
      </Animatable.Text>

      {ranking !== null && (
        <Animatable.Text animation="fadeIn" delay={900} style={shooterGoStyles.gameOverRank}>
          🏅 Ranking: {ranking}
        </Animatable.Text>
      )}

      <Animatable.View animation="zoomIn" delay={1000}>
        <TouchableOpacity
          onPress={() => navigation.replace('BubbleShooter')}
          style={[shooterGoStyles.gameOverButtonContainer, shooterGoStyles.glowEffect]}
        >
          <Text style={shooterGoStyles.gameOverButtonText}>▶ Play Again</Text>
        </TouchableOpacity>
      </Animatable.View>

      <Animatable.View animation="zoomIn" delay={1200}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={[shooterGoStyles.gameOverButtonContainer, shooterGoStyles.glowEffect]}
        >
          <Text style={shooterGoStyles.gameOverButtonText}>🏡 Back to Menu</Text>
        </TouchableOpacity>
      </Animatable.View>


      <Animatable.Text animation="fadeInUp" delay={1400} style={shooterGoStyles.topListTitle}>
        ✨ Top List ✨
      </Animatable.Text>

      <ScrollView style={shooterGoStyles.topListContainer}>
        {results.length > 0 ? (
          results.map(renderTopListItem)
        ) : (
          <Text style={shooterGoStyles.topListScore}>No scores yet!</Text>
        )}
      </ScrollView>
    </LinearGradient>
  );
};

export default ShooterGameOver;
