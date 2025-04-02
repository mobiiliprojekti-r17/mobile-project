
import React, { useRef, useState, useMemo, useEffect } from "react";
import { View, StyleSheet, PanResponder, Text, Button } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Paddle, Ball, Brick } from "./BrickBreakRender";
import { Physics } from "../utils/BrickPhysics";
import { useNavigation, useRoute } from "@react-navigation/native";
import { db } from "../../../firebase/Config";
import { collection, getDocs, query, orderBy, addDoc } from "firebase/firestore";

Matter.Resolver._restingThresh = 0.001;
Matter.Resolver._positionDampen = 0.01;
Matter.Resolver._positionWarming = 0.01;
Matter.Resolver._frictionNormalMultiplier = 1.0;

const setupWorld = (level = 1) => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  engine.world.gravity.y = 0;

  const ball = Matter.Bodies.circle(200, 520, 10, {
    isStatic: true,
    label: "ball",
    restitution: 1.0,
    friction: 0,
    frictionAir: 0,
    inertia: Infinity,
    isStatic: false,
    collisionFilter: { group: -1 },
  });

  const paddle = Matter.Bodies.rectangle(200, 550, 100, 20, {
    isStatic: true,
    collisionFilter: { category: 0x0002, mask: 0x0004 },
  });

  const wallLeft = Matter.Bodies.rectangle(0, 300, 20, 600, { isStatic: true });
  const wallRight = Matter.Bodies.rectangle(400, 300, 20, 600, { isStatic: true });
  const ceiling = Matter.Bodies.rectangle(200, 0, 400, 20, { isStatic: true });

  const bricks = [];
  const brickCols = 6;
  const brickRows = 6;
  const brickWidth = 50;
  const brickHeight = 30;
  const spacingX = 8;
  const spacingY = 10;

  const totalBrickWidth = brickCols * brickWidth + (brickCols - 1) * spacingX;
  const startX = (400 - totalBrickWidth) / 2;
  const specialBrickIndex = new Set();
  while (specialBrickIndex.size < 2) {
    specialBrickIndex.add(Math.floor(Math.random() * (brickCols * brickRows)));
  }

  for (let i = 0; i < brickCols; i++) {
    for (let j = 0; j < brickRows; j++) {
      const x = startX + i * (brickWidth + spacingX) + brickWidth / 2;
      const y = 100 + j * (brickHeight + spacingY);
      const index = i * brickRows + j;
      const isSpecial = specialBrickIndex.has(index) && j < 4;

      const brick = Matter.Bodies.rectangle(x, y, brickWidth, brickHeight, {
        label: isSpecial ? `brick_special_${i}_${j}` : `brick_${i}_${j}`,
        isStatic: true,
        collisionFilter: { category: 0x0008, mask: 0x0004 },
      });

      bricks.push(brick);
    }
  }

  Matter.World.add(world, [wallLeft, wallRight, ceiling, ball, paddle, ...bricks]);
  return { engine, world, ball, paddle, bricks, level, wallLeft, wallRight, ceiling };
};

export default function BrickBreaker() {
  const navigation = useNavigation();
  const route = useRoute();
  const [nickname, setNickname] = useState(route.params?.nickname);

  const gameEngine = useRef(null);
  const [gameState, setGameState] = useState(setupWorld());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [levelCleared, setLevelCleared] = useState(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
          const maxX = 400 - 50;
          const minX = 50;
          if (gameState.paddle) {
            Matter.Body.setPosition(gameState.paddle, {
              x: Math.min(Math.max(gesture.moveX, minX), maxX),
              y: 550,
            });
          }
        },
      }),
    [gameState.paddle]
  );

  const storeResult = async () => {
    try {
      await addDoc(collection(db, "BreakerResults"), {
        Nickname: nickname,
        level: gameState.level,
        score: score,
      });
      console.log("Result stored in Firestore.");
    } catch (error) {
      console.error("Error storing result: ", error);
    }
    navigation.navigate("BreakerResults", {
      nickname,
      level: gameState.level,
      score,
    });
  };

  useEffect(() => {
    if (!route.params?.nickname) {
      const fetchNickname = async () => {
        try {
          const q = query(
            collection(db, "NicknameList"),
            orderBy("__name__", "asc")
          );
          const querySnapshot = await getDocs(q);
          if (querySnapshot.docs.length > 0) {
            const fetched = querySnapshot.docs[querySnapshot.docs.length - 1].data().nickname;
            setNickname(fetched || "Guest");
          } else {
            setNickname("Guest");
          }
        } catch (error) {
          console.error("Error fetching nickname:", error);
          setNickname("Guest");
        }
      };
      fetchNickname();
    }
  }, [route.params?.nickname]);

  const nextLevel = () => {
    const newLevel = gameState.level + 1;
    const newGameState = setupWorld(newLevel);
    setGameState(newGameState);
    setGameOver(false);
    setGameStarted(false);
    setLevelCleared(false);

    setTimeout(() => {
      gameEngine.current.swap({
        physics: { engine: newGameState.engine, world: newGameState.world },
        ball: { 
          body: newGameState.ball, 
          renderer: Ball, 
          themeIndex: gameState.level,
        },
        paddle: { body: newGameState.paddle, renderer: Paddle },
        wallLeft: { body: newGameState.wallLeft },
        wallRight: { body: newGameState.wallRight },
        ceiling: { body: newGameState.ceiling },
        ...newGameState.bricks.reduce((acc, brick, index) => {
          acc[`brick_${index}`] = { body: brick, renderer: Brick };
          return acc;
        }, {}),
      });
    }, 50);
  };

  const gameOverHandler = () => {
    setGameOver(true);
    setGameStarted(false);
    setLevelCleared(false);
    gameEngine.current.stop();
    storeResult();
  };

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Text style={styles.score}>
        Pisteet: {score} | Taso: {gameState.level}
      </Text>

      {gameOver && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>Peli päättyi!</Text>
          <Button
            title="Try Again"
            onPress={() => {
              const newGameState = setupWorld(1);
              setGameOver(false);
              setLevelCleared(false);
              setScore(0);
              setGameStarted(false);
              setGameState(newGameState);

              setTimeout(() => {
                gameEngine.current.swap({
                  physics: { engine: newGameState.engine, world: newGameState.world },
                  ball: { body: newGameState.ball, renderer: Ball },
                  paddle: { body: newGameState.paddle, renderer: Paddle },
                  wallLeft: { body: newGameState.wallLeft },
                  wallRight: { body: newGameState.wallRight },
                  ceiling: { body: newGameState.ceiling },
                  ...newGameState.bricks.reduce((acc, brick, index) => {
                    acc[`brick_${index}`] = { body: brick, renderer: Brick };
                    return acc;
                  }, {}),
                });
              }, 50);
            }}
          />
          <Button
            title="Results"
            onPress={() =>
              navigation.navigate("BreakerResults", {
                nickname,
              })
            }
          />
        </View>
      )}

      {levelCleared && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>Taso läpäisty!</Text>
          <Button title="Next Level" onPress={nextLevel} />
        </View>
      )}

      {!gameOver && !levelCleared && !gameStarted && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>Press to Start</Text>
          <Button
            title="Start"
            onPress={() => {
              setGameStarted(true);
              const baseSpeed = 3;
              const fixedSpeed = baseSpeed + gameState.level;
              Matter.Body.setVelocity(gameState.ball, { x: fixedSpeed, y: -fixedSpeed });
            }}
          />
        </View>
      )}

      <GameEngine
        ref={gameEngine}
        style={styles.gameContainer}
        systems={[Physics]}
        running={gameStarted}
        entities={{
          physics: { engine: gameState.engine, world: gameState.world },
          ball: { 
            body: gameState.ball, 
            renderer: Ball, 
            themeIndex: gameState.level,
          },
          paddle: { body: gameState.paddle, renderer: Paddle },
          wallLeft: { body: gameState.wallLeft },
          wallRight: { body: gameState.wallRight },
          ceiling: { body: gameState.ceiling },
          ...gameState.bricks.reduce((acc, brick, index) => {
            acc[`brick_${index}`] = { body: brick, renderer: Brick };
            return acc;
          }, {}),
        }}
        onEvent={(e) => {
          if (e.type === "increase-score") {
            setScore((prev) => prev + 1);
          } else if (e.type === "game-over") {
            gameOverHandler();
          } else if (e.type === "level-cleared") {
            setLevelCleared(true);
            setGameStarted(false);
          }
        }}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#483471" },
  gameContainer: { flex: 1 },
  score: { color: "white", fontSize: 20, textAlign: "center", margin: 10 },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 10,
  },
  gameOverText: { color: "white", fontSize: 30, marginBottom: 20 },
});
