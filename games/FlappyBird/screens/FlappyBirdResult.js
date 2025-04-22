import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, SafeAreaView,
  KeyboardAvoidingView, Platform, TouchableOpacity
} from 'react-native';
import { db } from '../../../firebase/Config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useNickname } from '../../../context/context';
import FlappyStyles from '../FlappyStyles/FlappyBirdStyles';


export default function FlappyResult({ route, navigation }) {
  const { nickname } = useNickname();
  const { score }    = route.params;
  const [results, setResults]   = useState([]);
  const [ownRank, setOwnRank]   = useState(null);

  useEffect(() => {
    navigation.setOptions({ headerLeft: () => null, gestureEnabled: false });
  }, [navigation]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        // 1) Hae TOP10
        const topQ = query(
          collection(db, 'FlappyBirdResults'),
          orderBy('score', 'desc'),
          limit(10)
        );
        const topSnap = await getDocs(topQ);
        setResults(topSnap.docs.map(d => d.data()));

        // 2) Hae koko lista rankingin laskua varten
        const allQ = query(
          collection(db, 'FlappyBirdResults'),
          orderBy('score', 'desc')
        );
        const allSnap = await getDocs(allQ);
        const allList = allSnap.docs.map(d => d.data());

        // 3) Laske oma sijasi
        const idx = allList.findIndex(r => r.Nickname === nickname && r.score === score);
        setOwnRank(idx >= 0 ? idx + 1 : allList.length + 1);
      } catch (err) {
        console.error('Fetching results failed:', err);
      }
    };
    fetchResults();
  }, [navigation, nickname, score]);

  const medal = (idx) => (['🥇','🥈','🥉'][idx] ?? `${idx+1}.`);

  return (
    <SafeAreaView style={[FlappyStyles.container, { backgroundColor: '#71c5cf', paddingHorizontal: 24 }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={FlappyStyles.title}>Game Over!</Text>

        <View style={FlappyStyles.scoreCard}>
          <Text style={FlappyStyles.playerLine}>
            <Text style={FlappyStyles.label}>Player: </Text>{nickname}
          </Text>
          <Text style={FlappyStyles.playerLine}>
            <Text style={FlappyStyles.label}>Score: </Text>{score}
          </Text>
          {ownRank !== null && (
            <Text style={FlappyStyles.playerLine}>
              <Text style={FlappyStyles.label}>Ranking: </Text>#{ownRank}
            </Text>
          )}
        </View>

        <Text style={FlappyStyles.leaderTitle}>Top 10</Text>

        <ScrollView
          style={FlappyStyles.scroll}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {results.length ? (
            results.map((r, i) => (
              <View
                key={i}
                style={[
                  FlappyStyles.row,
                  i === 0 && FlappyStyles.rowGold,
                  i === 1 && FlappyStyles.rowSilver,
                  i === 2 && FlappyStyles.rowBronze,
                  r.Nickname === nickname && FlappyStyles.rowSelf,
                ]}
              >
                <Text style={FlappyStyles.rowText}>{medal(i)}</Text>
                <Text style={[FlappyStyles.rowText, { flex: 1 }]}>{r.Nickname}</Text>
                <Text style={FlappyStyles.rowText}>{r.score}</Text>
              </View>
            ))
          ) : (
            <Text style={FlappyStyles.noScores}>No scores yet!</Text>
          )}
        </ScrollView>

        <View style={FlappyStyles.buttonBar}>
          <TouchableOpacity
            style={FlappyStyles.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={FlappyStyles.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={FlappyStyles.button}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={FlappyStyles.buttonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
