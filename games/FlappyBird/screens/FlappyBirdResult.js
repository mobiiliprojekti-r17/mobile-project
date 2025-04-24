// Tuodaan React, React Native ja Firestore-kirjastot sekä omat kontekstit ja tyylit
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { db } from '../../../firebase/Config';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { useNickname } from '../../../context/context';
import FlappyStyles from '../FlappyStyles/FlappyBirdStyles';

/**
 * FlappyResult-komponentti: näyttää pelin lopputuloksen, oman rankingin ja Top 10 -listan
 * @param {object} route - navigaation kautta saadut parametrit (score)
 * @param {object} navigation - navigaatiometodi komponentin vaihtamiseen
 */
export default function FlappyResult({ route, navigation }) {
  const { nickname } = useNickname();       // Haetaan pelaajan nimi kontekstista
  const { score }    = route.params;         // Otetaan reitin parametrista pistemäärä

  // Tila tallennettaville tuloksille ja oman rankingin laskemiseen
  const [results, setResults] = useState([]);
  const [ownRank, setOwnRank] = useState(null);

  // Poistaa takaisin-painikkeen headeristä ja estää pyyhkäisyn pois-navigoinnin
  useEffect(() => {
    navigation.setOptions({ headerLeft: () => null, gestureEnabled: false });
  }, [navigation]);

  // Haetaan tulokset Firestoresta: Top 10 ja koko lista oman rankingin laskemista varten
  useEffect(() => {
    const fetchResults = async () => {
      try {
        // Hae Top 10 korkeimmat pistemäärät laskevassa järjestyksessä
        const topQ = query(
          collection(db, 'FlappyBirdResults'),
          orderBy('score', 'desc'),
          limit(10)
        );
        const topSnap = await getDocs(topQ);
        setResults(topSnap.docs.map(d => d.data()));

        //  Hae koko lista rankingin laskua varten (järjestetty pistemäärän mukaan)
        const allQ = query(
          collection(db, 'FlappyBirdResults'),
          orderBy('score', 'desc')
        );
        const allSnap = await getDocs(allQ);
        const allList = allSnap.docs.map(d => d.data());

        // Etsi oma sijasi listalta (ensimmäinen täsmäävä Nickname + score)
        const idx = allList.findIndex(
          r => r.Nickname === nickname && r.score === score
        );
        setOwnRank(idx >= 0 ? idx + 1 : allList.length + 1);

      } catch (err) {
        console.error('Tulosten haku epäonnistui:', err);
      }
    };
    fetchResults();
  }, [navigation, nickname, score]);

  
    // Palauttaa medal-merkinnän indeksin perusteella: 🥇🥈🥉 tai numero
   
  const medal = (idx) => (['🥇','🥈','🥉'][idx] ?? `${idx+1}.`);

  return (
    // SafeAreaView takaa sisällön sijoittumisen näytölle oikein
    <SafeAreaView style={[FlappyStyles.container, { backgroundColor: '#71c5cf', paddingHorizontal: 24 }]}>      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Päänäyttö tekstillä "Game Over!" */}
        <Text style={FlappyStyles.title}>Game Over!</Text>

        {/* Pelaajan oma tuloskortti: nimi, pisteet ja sijoitus */}
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

        {/* Top 10 -listan otsikko */}
        <Text style={FlappyStyles.leaderTitle}>Top 10</Text>

        {/* Vieritettävä lista top10-tuloksista */}
        <ScrollView
          style={FlappyStyles.scroll}
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {results.length ? (
            results.map((r, i) => (
              // Jokainen rivi korostaa "mitallistit".
              <View
                key={i}
                style={[
                  FlappyStyles.row,
                  i === 0 && FlappyStyles.rowGold,
                  i === 1 && FlappyStyles.rowSilver,
                  i === 2 && FlappyStyles.rowBronze,
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

        {/* Alhaalta löytyvät napit: Back ja Home */}
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