import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Vibration } from 'react-native';
import styles from '../styles/Styles';
import modalStyles from '../styles/modalStyles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNickname } from "../../../context/context";
import { db, collection, addDoc } from "../../../firebase/Config";
import { useNavigation } from "@react-navigation/native";

const LEVEL_CONFIGS = [
  { numColors: 4, layersPerBottle: 4, emptyBottles: 2 },
  { numColors: 6, layersPerBottle: 4, emptyBottles: 2 },
  { numColors: 7, layersPerBottle: 4, emptyBottles: 2 },
  { numColors: 8, layersPerBottle: 4, emptyBottles: 2 },
];

function generateRandomBottles({ numColors, layersPerBottle, emptyBottles }) {
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
  used.forEach(c => {
    for (let i = 0; i < layersPerBottle; i++) pool.push(c);
  });
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const bottles = [];
  const fullCount = pool.length / layersPerBottle;
  for (let i = 0; i < fullCount; i++) {
    bottles.push(pool.slice(i * layersPerBottle, (i + 1) * layersPerBottle));
  }
  for (let i = 0; i < emptyBottles; i++) bottles.push([]);
  return bottles;
}

const getValidMoves = (bottles, config) => {
  const moves = [];
  bottles.forEach((from, i) => {
    if (!from.length) return;
    const color = from[from.length - 1];
    bottles.forEach((to, j) => {
      if (i === j) return;
      if (to.length >= config.layersPerBottle) return;
      if (!to.length || to[to.length - 1] === color) {
        moves.push({ from: i, to: j });
      }
    });
  });
  return moves;
};

const isUsefulMove = (bottles, config, fromIdx, toIdx) => {
  const from = [...bottles[fromIdx]];
  const to = [...bottles[toIdx]];
  if (!from.length) return false;
  const color = from[from.length - 1];
  if (to.length >= config.layersPerBottle) return false;
  if (to.length && to[to.length - 1] !== color) return false;

  const fromTopBefore = from[from.length - 1];
  const toTopBefore = to.length ? to[to.length - 1] : null;

  let cnt = 0;
  while (from.length && from[from.length - 1] === color && to.length + cnt < config.layersPerBottle) {
    from.pop();
    cnt++;
  }
  for (let k = 0; k < cnt; k++) to.push(color);

  const fromTopAfter = from.length ? from[from.length - 1] : null;
  const toTopAfter = to[to.length - 1];
  const fromEmptied = from.length === 0;

  return fromEmptied || fromTopAfter !== fromTopBefore || toTopAfter !== toTopBefore;
};

const saveColorSortResult = async (nickname, time, moves) => {
  try {
    await addDoc(collection(db, "ColorSortResults"), { nickname, time, moves });
  } catch (e) {
    console.error(e);
  }
};

export default function ColorSortGame() {
  const navigation = useNavigation();
  const { nickname } = useNickname();

  const [level, setLevel] = useState(0);
  const [bottles, setBottles] = useState([]);
  const [selected, setSelected] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [moves, setMoves] = useState(0);
  const [shakeIndex, setShakeIndex] = useState(null);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const [confettiBottle, setConfettiBottle] = useState(null);
  const confettiAnim = useRef(new Animated.Value(0)).current;

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalButtonText, setModalButtonText] = useState("");
  const [modalButtonAction, setModalButtonAction] = useState(() => {});

  const modalShown = useRef(false);

  useEffect(() => {
    const cfg = LEVEL_CONFIGS[level];
    setBottles(generateRandomBottles(cfg));
    setLastMove(null);
  }, [level]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsedTime(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const formatTime = s => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${m}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const triggerShake = (index) => {
    setShakeIndex(index);
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start(() => setShakeIndex(null));
  };

  const triggerConfetti = (index) => {
    setConfettiBottle(index);
    confettiAnim.setValue(0);

    Vibration.vibrate([0, 100, 50, 100]);

    Animated.timing(confettiAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => setConfettiBottle(null));
  };


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

  const checkWin = (bts, mv) => {
    const cfg = LEVEL_CONFIGS[level];
    const win = bts.every(b => !b.length || (b.length === cfg.layersPerBottle && new Set(b).size === 1));
    if (!win || modalShown.current) return;
    modalShown.current = true;
    setRunning(false);

    if (level === LEVEL_CONFIGS.length - 1) {
      saveColorSortResult(nickname, elapsedTime, mv);
      showGameOverModal("Game Over", `Time: ${formatTime(elapsedTime)}\nMoves: ${mv}`);
    } else {
      showLevelModal(
        `Level ${level + 1} complete!`,
        `Time: ${formatTime(elapsedTime)}\nMoves: ${mv}`,
        "Next Level",
        () => { setLastMove(null); setLevel(l => l + 1); setRunning(true); }
      );
    }
  };

  const pour = (i, j) => {
    const cfg = LEVEL_CONFIGS[level];
    const from = [...bottles[i]];
    const to = [...bottles[j]];
    if (!from.length) return;
    const color = from[from.length - 1];
    if (to.length >= cfg.layersPerBottle) {
      triggerShake(j); // j on kohdepullon indeksi
      return;
    }
    if (to.length && to[to.length - 1] !== color) {
      triggerShake(j); // j on kohdepullon indeksi
      return;
    }    
    setLastMove(bottles.map(b => [...b]));

    let cnt = 0;
    while (from.length && from[from.length - 1] === color && to.length + cnt < cfg.layersPerBottle) {
      from.pop(); cnt++;
    }
    for (let k = 0; k < cnt; k++) to.push(color);

    const newMoves = moves + 1;
    setMoves(newMoves);

    const newBottles = [...bottles];
    newBottles[i] = from;
    newBottles[j] = to;
    setBottles(newBottles);
    if (to.length === cfg.layersPerBottle && new Set(to).size === 1) {
      triggerConfetti(j); // j on kohdepullon indeksi
    }

    checkWin(newBottles, newMoves);

    // tsekkaa hyödyllisiä siirtoja
    const valid = getValidMoves(newBottles, cfg);
const useful = valid.filter(m => isUsefulMove(newBottles, cfg, m.from, m.to));

if (!useful.length && !modalShown.current) {
  modalShown.current = true;
  setRunning(false);
  // Viivästetään modaalin näyttöä 500 ms:
  setTimeout(() => {
    showNoMovesModal(
      "No More Moves",
      "No meaningful moves remain—top colors won't change nor bottles empty."
    );
  }, 1000);
}
  };

  const handlePress = idx => {
    if (selected === null) {
      if (bottles[idx].length) setSelected(idx);
    } else {
      if (idx === selected) setSelected(null);
      else { pour(selected, idx); setSelected(null); }
    }
  };

  const handleUndo = () => {
    if (lastMove) {
      setBottles(lastMove);
      setLastMove(null);
      setMoves(prev => Math.max(0, prev - 1)); // vähennetään siirtoja, mutta ei alle 0
    }
  };
  

  const restart = () => {
    setLevel(0);
    setElapsedTime(0);
    setMoves(0);
    setRunning(false);
    setLastMove(null);
    modalShown.current = false;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>💧 Level {level+1}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Time: {formatTime(elapsedTime)}</Text>
          <Text style={styles.statusText}>Moves: {moves}</Text>
        </View>
        <View style={styles.bottleContainer}>
          {bottles.map((b, i) => (
            <Animated.View
            key={i}
            style={{
              transform: [
                {
                  translateX: shakeIndex === i
                    ? shakeAnim.interpolate({
                        inputRange: [-1, 1],
                        outputRange: [-5, 5],
                      })
                    : 0,
                },
              ],
            }}
          >
            <TouchableOpacity
              onPress={() => handlePress(i)}
              style={styles.bottleWrapper}
            >
              <View style={styles.bottleInner}>
                {Array.from({ length: LEVEL_CONFIGS[level].layersPerBottle }).map((_, k) => {
                  const c = b[LEVEL_CONFIGS[level].layersPerBottle - 1 - k];
                  return (
                    <View
                      key={k}
                      style={[styles.layer, { backgroundColor: c || "lightgray" }]}
                    />
                  );
                })}
              </View>
              <View
                style={[
                  styles.bottleBorder,
                  selected === i && { borderColor: "gold", borderWidth: 3 },
                ]}
                pointerEvents="none"
              />
            </TouchableOpacity>
            {confettiBottle === i && (
  <Animated.Text
    style={{
      position: "absolute",
      top: -20,
      alignSelf: "center",
      opacity: confettiAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
      transform: [
        {
          translateY: confettiAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -50],
          }),
        },
      ],
      fontSize: 24,
    }}
  >
    🎉🎊
  </Animated.Text>
)}

          </Animated.View>
          
          ))}
        </View>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={handleUndo}
            disabled={!lastMove}
            style={[styles.actionButton, !lastMove && { backgroundColor: "gray" }]}
          >
            <MaterialCommunityIcons name="undo" size={25} color="#fff" />
            <Text style={[styles.actionButtonText, !lastMove && { color: "lightgray" }]}>
              Undo
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.actionButton}>
            <MaterialCommunityIcons name="home" size={25} color="#fff" />
            <Text style={styles.actionButtonText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={restart} style={styles.actionButton}>
            <MaterialCommunityIcons name="restart" size={25} color="#fff" />
            <Text style={styles.actionButtonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {!running && elapsedTime === 0 && (
        <View style={styles.overlay}>
          <TouchableOpacity style={styles.startButton} onPress={() => setRunning(true)}>
            <Text style={styles.startButtonText}>START</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={modalStyles.modalContainer}>
          <View style={modalStyles.modalContent}>
            <Text style={modalStyles.modalTitle}>{modalTitle}</Text>
            <Text style={modalStyles.modalMessage}>{modalMessage}</Text>
            <View style={modalStyles.buttonContainer}>
              {modalType === "LEVEL" && (
                <TouchableOpacity
                  style={modalStyles.modalButton}
                  onPress={() => {
                    modalButtonAction(); setModalVisible(false); modalShown.current = false;
                  }}
                >
                  <Text style={modalStyles.modalButtonText}>{modalButtonText}</Text>
                </TouchableOpacity>
              )}
              {modalType === "GAME_OVER" && (
                <>
                  <TouchableOpacity
                    style={modalStyles.modalButton}
                    onPress={() => {
                      setModalVisible(false); modalShown.current = false;
                      navigation.navigate("ColorSortResultScreen", {
                        nickname, moves, time: elapsedTime
                      });
                    }}
                  >
                    <Text style={modalStyles.modalButtonText}>Results</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={modalStyles.modalButton}
                    onPress={() => {
                      setModalVisible(false); modalShown.current = false; restart();
                    }}
                  >
                    <Text style={modalStyles.modalButtonText}>Play Again</Text>
                  </TouchableOpacity>
                </>
              )}
              {modalType === "NO_MOVES" && (
                <>
                  {lastMove && (
                    <TouchableOpacity
                      style={modalStyles.modalButton}
                      onPress={() => {
                        handleUndo(); setModalVisible(false); modalShown.current = false;
                      }}
                    >
                      <Text style={modalStyles.modalButtonText}>Undo Last Move</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={modalStyles.modalButton}
                    onPress={() => {
                      setModalVisible(false); modalShown.current = false; restart();
                    }}
                  >
                    <Text style={modalStyles.modalButtonText}>Play Again</Text>
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
