import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Vibration } from 'react-native';
import styles from '../styles/Styles'; 
import modalStyles from '../styles/modalStyles'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNickname } from "../../../context/context"; 
import { db, collection, addDoc } from "../../../firebase/Config"; 
import { useNavigation } from "@react-navigation/native";

// Tasojen asetukset: värimäärät, kerrokset pulloissa ja tyhjien pullojen määrä
const LEVEL_CONFIGS = [
  { numColors: 4, layersPerBottle: 4, emptyBottles: 2 },
  { numColors: 6, layersPerBottle: 4, emptyBottles: 2 },
  { numColors: 7, layersPerBottle: 4, emptyBottles: 2 },
  { numColors: 8, layersPerBottle: 4, emptyBottles: 2 },
];

// Luo satunnaiset pullot määriteltyjen asetusten mukaisesti
function generateRandomBottles({ numColors, layersPerBottle, emptyBottles }) {
  //Värit pulloissa
  const COLORS = [
    "rgb(255, 158, 226)",
    "rgb(255, 246, 143)",
    "rgb(137, 197, 253)",
    "rgb(194, 255, 154)",
    "rgb(251, 151, 137)",
    "rgb(255, 199, 144)",
    "rgb(158, 132, 252)",
    "rgb(153, 255, 204)",
  ];
  const used = COLORS.slice(0, numColors);
  const pool = [];
  // Täytetään pool kerrosväreillä
  used.forEach(c => {
    for (let i = 0; i < layersPerBottle; i++) pool.push(c);
  });
  // Sekoitetaan satunnaisesti
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const bottles = [];
  const fullCount = pool.length / layersPerBottle;
  // Jaetaan pool valmiiksi täysiksi pulloiksi
  for (let i = 0; i < fullCount; i++) {
    bottles.push(pool.slice(i * layersPerBottle, (i + 1) * layersPerBottle));
  }
  // Lisätään tyhjiä pulloja
  for (let i = 0; i < emptyBottles; i++) bottles.push([]);
  return bottles;
}

// Palauttaa kaikki mahdolliset siirrot (lähdepullo -> kohdepullo)
const getValidMoves = (bottles, config) => {
  const moves = [];
  bottles.forEach((from, i) => {
    if (!from.length) return; // jos lähdepullo tyhjä, ohitetaan
    const color = from[from.length - 1]; // päällimmäinen väri
    bottles.forEach((to, j) => {
      if (i === j) return;
      if (to.length >= config.layersPerBottle) return; // täysi
      if (!to.length || to[to.length - 1] === color) {
        moves.push({ from: i, to: j });
      }
    });
  });
  return moves;
};

// Tarkistaa, että siirto todella muuttaa tilaa = hyödyllinen pelin etenemisen kannalta
const isUsefulMove = (bottles, config, fromIdx, toIdx) => {
  // Kopioidaan pullot muokkaukseen
  const from = [...bottles[fromIdx]];
  const to = [...bottles[toIdx]];
  if (!from.length) return false;
  const color = from[from.length - 1];
  if (to.length >= config.layersPerBottle) return false;
  if (to.length && to[to.length - 1] !== color) return false;

  // Lasketaan kuinka monta kerrosta siirretään
  let cnt = 0;
  while (from.length && from[from.length - 1] === color && to.length + cnt < config.layersPerBottle) {
    from.pop(); cnt++;
  }
  // Siirretään sama määrä värejä to‑pulloon
  for (let k = 0; k < cnt; k++) to.push(color);

  // Jos päälimmäinen väri pullossa vaihtui tai pullo tulee tyhjäksi, on hyödyllinen siirto
  return true;
};

// Tallentaa tuloksen Firebaseen: aika ja siirrot
const saveColorSortResult = async (nickname, timeInSeconds, moves) => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  try {
    await addDoc(
      collection(db, "ColorSortResults"),
      {
        nickname,
        time: formattedTime,
        moves: Number(moves),
      }
    );
  } catch (e) {
    console.error(e);
  }
};

export default function ColorSortGame() {
  const navigation = useNavigation();
  const { nickname } = useNickname();

  // Pelin tila‑muuttujat
  const [level, setLevel] = useState(0);
  const [bottles, setBottles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [history, setHistory] = useState([]);       // Edelliset tilat undoa varten
  const [elapsedTime, setElapsedTime] = useState(0);
  const [running, setRunning] = useState(false);    // Ajastin päällä / pois
  const [moves, setMoves] = useState(0);

  // Animaatiot tärinälle ja konfetti‑efektille
  const [shakeIndex, setShakeIndex] = useState(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [confettiBottle, setConfettiBottle] = useState(null);
  const confettiAnim = useRef(new Animated.Value(0)).current;

  // Modaalin tilat
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalButtonText, setModalButtonText] = useState("");
  const [modalButtonAction, setModalButtonAction] = useState(() => {});
  const modalShown = useRef(false);

  // Kun vaihtuu taso, generoidaan uudet pullot ja nollataan historia
  useEffect(() => {
    const cfg = LEVEL_CONFIGS[level];
    setBottles(generateRandomBottles(cfg));
    setHistory([]);
    modalShown.current = false;
  }, [level]);

  // Ajastimen päivitys kerran sekunnissa, kun peli käynnissä
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Muotoile sekunnit minuuteiksi
  const formatTime = s => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  // Shake-animaatio valitulle pullolle
  const triggerShake = index => {
    setShakeIndex(index);
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start(() => setShakeIndex(null));
  };

  // Konfetti‑animaatio, kun pullo täyttyy yhdellä värillä
  const triggerConfetti = index => {
    setConfettiBottle(index);
    confettiAnim.setValue(0);
    Vibration.vibrate([0, 100, 50, 100]);
    Animated.timing(confettiAnim, { toValue: 1, duration: 800, useNativeDriver: true })
      .start(() => setConfettiBottle(null));
  };

  // Näytetään eri tyyppiset modaalit
  const showLevelModal = (t, msg, btn, action) => {
    setModalType("LEVEL");
    setModalTitle(t);
    setModalMessage(msg);
    setModalButtonText(btn);
    setModalButtonAction(() => action);
    setModalVisible(true);
  };
  const showGameOverModal = (t, msg) => {
    setModalType("GAME_OVER");
    setModalTitle(t);
    setModalMessage(msg);
    setModalVisible(true);
  };
  const showNoMovesModal = (t, msg) => {
    setModalType("NO_MOVES");
    setModalTitle(t);
    setModalMessage(msg);
    setModalVisible(true);
  };

  // Tarkistetaan, onko kaikissa pulloissa joko tyhjää tai yksi väri täsmälleen kerroksittain
  const checkWin = (bts, mv) => {
    const cfg = LEVEL_CONFIGS[level];
    const win = bts.every(b =>
      !b.length ||
      (b.length === cfg.layersPerBottle && new Set(b).size === 1)
    );
    if (!win || modalShown.current) return;
    modalShown.current = true;
    setRunning(false);

    // Viimeinen taso: tallenna tulos ja näytä lopetusmodal
    if (level === LEVEL_CONFIGS.length - 1) {
      saveColorSortResult(nickname, elapsedTime, mv);
      showGameOverModal("Game Over!", `Time: ${formatTime(elapsedTime)}\nMoves: ${mv}`);
    } else {
      // Siirry seuraavalle tasolle
      showLevelModal(
        `Level ${level + 1} complete!`,
        `Time so far: ${formatTime(elapsedTime)}\nMoves so far: ${mv}`,
        "Next Level",
        () => { setLevel(l => l + 1); setRunning(true); }
      );
    }
  };

  // Suorittaa värin siirron lähdepullosta kohdepulloon
  const pour = (i, j) => {
    const cfg = LEVEL_CONFIGS[level];
    const from = [...bottles[i]];
    const to = [...bottles[j]];
    if (!from.length) return;

    const color = from[from.length - 1];
    // Jos ei voi kaataa, esimerkiksi täyteen tai väärä väri, pullo tekee shake-animaation
    if (to.length >= cfg.layersPerBottle || (to.length && to[to.length - 1] !== color)) {
      triggerShake(j);
      return;
    }

    // Tallenna undo‐historia viimeisillä kahdella tilalla
    setHistory(prev => [...prev, bottles].slice(-2));

    // Siirrä peräkkäiset päällimmäiset kerrokset
    let cnt = 0;
    while (from.length && from[from.length - 1] === color && to.length + cnt < cfg.layersPerBottle) {
      from.pop(); cnt++;
    }
    for (let k = 0; k < cnt; k++) to.push(color);

    setMoves(prev => prev + 1);
    const newBottles = [...bottles];
    newBottles[i] = from;
    newBottles[j] = to;
    setBottles(newBottles);

    // Jos pullo täyttyi yhdellä värillä, pullosta tulee konfettia
    if (to.length === cfg.layersPerBottle && new Set(to).size === 1) {
      triggerConfetti(j);
    }

    // Tarkista voitto ja mahdolliset siirrot
    checkWin(newBottles, moves + 1);
    const valid = getValidMoves(newBottles, cfg);
    const useful = valid.filter(m => isUsefulMove(newBottles, cfg, m.from, m.to));
    if (!useful.length && !modalShown.current) {
      modalShown.current = true;
      setRunning(false);
      setTimeout(() => showNoMovesModal(
        "No more moves!",
        "Undo last move or Play again",
      ), 500);
    }
  };

  // Käsittelee pullon valinnan ja kaadon, kun on kaksi klikkausta
  const handlePress = idx => {
    if (selected === null) {
      if (bottles[idx].length) setSelected(idx);
    } else {
      if (idx !== selected) pour(selected, idx);
      setSelected(null);
    }
  };

  // Kumoa viimeisin siirto
  const handleUndo = () => {
    if (!history.length) return;
    const last = history[history.length - 1];
    setBottles(last);
    setHistory(prev => prev.slice(0, -1));
    setMoves(prev => Math.max(0, prev - 1));
  };

  // Aloita alusta tasolla 1
  const restart = () => {
    const cfg = LEVEL_CONFIGS[0];
    setBottles(generateRandomBottles(cfg));
    setLevel(0);
    setElapsedTime(0);
    setMoves(0);
    setHistory([]);
    setSelected(null);
    setRunning(false);
  };

  // Renderöi pullot animaatioineen
  const renderedBottles = bottles.map((b, i) => (
    <Animated.View
      key={i}
      style={{ transform: [{ translateX: shakeIndex === i
        ? shakeAnim.interpolate({ inputRange: [-1,1], outputRange: [-5,5] })
        : 0 }] }}
    >
      <TouchableOpacity onPress={() => handlePress(i)} style={styles.bottleWrapper}>
        <View style={styles.bottleInner}>
          {Array.from({ length: LEVEL_CONFIGS[level].layersPerBottle }).map((_, k) => (
            <View
              key={k}
              style={[
                styles.layer,
                { backgroundColor: b[LEVEL_CONFIGS[level].layersPerBottle - 1 - k] || 'lightgray' },
              ]}
            />
          ))}
        </View>
        <View
          style={[
            styles.bottleBorder,
            selected === i && { borderColor: '#4A148C', borderWidth: 3 },
          ]}
          pointerEvents="none"
        />
      </TouchableOpacity>
      {confettiBottle === i && (
        <Animated.Text
          style={{
            position: 'absolute',
            top: -20,
            alignSelf: 'center',
            opacity: confettiAnim.interpolate({ inputRange: [0,1], outputRange: [1,0] }),
            transform: [{ translateY: confettiAnim.interpolate({ inputRange: [0,1], outputRange: [0,-50] }) }],
            fontSize: 24,
          }}
        >
          🎉🎊
        </Animated.Text>
      )}
    </Animated.View>
  ));

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      {/* Aloitusnäyttö start-painikkeella */}
      {!running && elapsedTime === 0 && (
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.startButton} onPress={() => setRunning(true)}>
            <Text style={styles.startButtonText}>START GAME</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.container}>
        <Text style={styles.title1}>ColorSort</Text>
        <Text style={styles.title2}>Level {level + 1}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Time: {formatTime(elapsedTime)}</Text>
          <Text style={styles.statusText}>Moves: {moves}</Text>
        </View>

        {/* Pullojärjestely riveittäin tai kontin avulla */}
        <View style={styles.statsBox}>
          {level === 0 ? (
            <>
              <View style={styles.bottleRow}>{renderedBottles.slice(0, 3)}</View>
              <View style={styles.bottleRow}>{renderedBottles.slice(3, 6)}</View>
            </>
          ) : level === 1 ? (
            <>
              <View style={styles.bottleRow}>{renderedBottles.slice(0, 4)}</View>
              <View style={styles.bottleRow}>{renderedBottles.slice(4, 8)}</View>
            </>
          ) : (
            <View style={styles.bottleContainer}>{renderedBottles}</View>
          )}
        </View>

        {/* Toimintonapit: undo, home, restart */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={handleUndo}
            disabled={!history.length}
            style={[
              styles.actionButton,
              !history.length && { backgroundColor: "rgb(100, 73, 134)" }
            ]}
          >
            <MaterialCommunityIcons name="undo" size={25} color={history.length ? "#fff" : "lightgray"} />
            <Text style={[styles.actionButtonText, !history.length && { color: "lightgray" }]}>Undo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.actionButton}>
            <MaterialCommunityIcons name="home" size={25} color="#fff" />
            <Text style={styles.actionButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={restart} style={styles.actionButton}>
            <MaterialCommunityIcons name="restart" size={25} color="#fff" />
            <Text style={styles.actionButtonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modaalit eri tilanteille */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>{modalTitle}</Text>
            <Text style={modalStyles.modalMessage}>{modalMessage}</Text>
            <View style={modalStyles.buttonContainer}>
              {modalType === 'LEVEL' && (
                <TouchableOpacity
                  style={modalStyles.modalButton}
                  onPress={() => { modalButtonAction(); setModalVisible(false); modalShown.current = false; }}
                >
                  <Text style={modalStyles.modalButtonText}>{modalButtonText}</Text>
                </TouchableOpacity>
              )}
              {modalType === 'GAME_OVER' && (
                <>
                  <TouchableOpacity
                    style={modalStyles.modalButton}
                    onPress={() => {
                      setModalVisible(false);
                      modalShown.current = false;
                      navigation.navigate('ColorSortResultScreen', { nickname, moves, time: elapsedTime });
                    }}
                  >
                    <Text style={modalStyles.modalButtonText}>Results</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={modalStyles.modalButton}
                    onPress={() => { setModalVisible(false); modalShown.current = false; restart(); }}
                  >
                    <Text style={modalStyles.modalButtonText}>Play Again</Text>
                  </TouchableOpacity>
                </>
              )}
              {modalType === 'NO_MOVES' && (
                <>
                  {!!history.length && (
                    <TouchableOpacity
                      style={modalStyles.modalButton}
                      onPress={() => { handleUndo(); setModalVisible(false); modalShown.current = false; }}
                    >
                      <Text style={modalStyles.modalButtonText}>Undo last move</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={modalStyles.modalButton}
                    onPress={() => { setModalVisible(false); modalShown.current = false; restart(); }}
                  >
                    <Text style={modalStyles.modalButtonText}>Play again</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
