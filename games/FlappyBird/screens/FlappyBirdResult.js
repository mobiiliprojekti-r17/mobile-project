import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, SafeAreaView,
  KeyboardAvoidingView, Platform, TouchableOpacity
} from 'react-native';
import { db } from '../../../firebase/Config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useNickname } from '../../../context/context';
import FlappyStyles from '../FlappyStyles/FlappyStyles';

const base = FlappyStyles;              

export default function FlappyResult({ route, navigation }) {
  const { nickname } = useNickname();
  const { score }    = route.params;
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const q = query(
          collection(db, 'FlappyBirdResults'),
          orderBy('score', 'desc'),
          limit(10)
        );
        const snap = await getDocs(q);
        setResults(snap.docs.map(d => d.data()));
      } catch (err) {
        console.error('Fetching results failed:', err);
      }
    };
    fetchResults();
  }, [navigation]);

  useEffect(() => {
    navigation.setOptions({ headerLeft: () => null, gestureEnabled: false });
  }, [navigation]);

  const medal = (idx) => (['🥇','🥈','🥉'][idx] ?? `${idx+1}.`);

  return (
    <SafeAreaView style={[base.container, { paddingHorizontal: 24 }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={[styles.title]}>Game Over!</Text>

        <View style={styles.scoreCard}>
          <Text style={styles.playerLine}>
            <Text style={styles.label}>Player: </Text>{nickname}
          </Text>
          <Text style={styles.playerLine}>
            <Text style={styles.label}>Score: </Text>{score}
          </Text>
        </View>

        <Text style={styles.leaderTitle}>Top 10</Text>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {results.length ? (
            results.map((r, i) => (
              <View
                key={i}
                style={[
                  styles.row,
                  i === 0 && styles.rowGold,
                  i === 1 && styles.rowSilver,
                  i === 2 && styles.rowBronze,
                  r.Nickname === nickname && styles.rowSelf,
                ]}
              >
                <Text style={styles.rowText}>{medal(i)}</Text>
                <Text style={[styles.rowText, { flex: 1 }]}>{r.Nickname}</Text>
                <Text style={styles.rowText}>{r.score}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noScores}>No scores yet!</Text>
          )}
        </ScrollView>

        <View style={styles.buttonBar}>
          <TouchableOpacity
            style={base.button}
            onPress={() => navigation.goBack()}
          >
            <Text style={base.buttonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={base.button}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={base.buttonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = {
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    alignSelf: 'center',
    marginVertical: 12,
    textShadowColor: '#0008',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  scoreCard: {
    backgroundColor: '#ffffffaa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignSelf: 'stretch',
  },
  playerLine: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
    marginVertical: 2,
  },
  label: { fontWeight: '800', color: '#000' },

  leaderTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    alignSelf: 'center',
    textShadowColor: '#0008',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  scroll: { flex: 1, alignSelf: 'stretch' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#ffffffcc',
    borderRadius: 8,
    marginVertical: 3,
  },
  rowText: { fontSize: 18, fontWeight: '700', color: '#333' },

  noScores: {
    alignSelf: 'center',
    marginTop: 20,
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  rowGold:   { backgroundColor: '#ffeb3baa' },
  rowSilver: { backgroundColor: '#e0e0e0aa' },
  rowBronze: { backgroundColor: '#ffd180aa' },
  rowSelf:   { borderWidth: 2, borderColor: '#4caf50' },

  buttonBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 12,
  },
};
