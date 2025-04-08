import React, { useRef, useState, useMemo } from "react";
import {
  View,
  StyleSheet,
  PanResponder,
  Text,
  Button,
  Dimensions,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Paddle, Ball, Brick } from "./BrickBreakRender";
import { Physics } from "../utils/BrickPhysics";
import { useNavigation } from "@react-navigation/native";
import { db } from "../../../firebase/Config";
import { collection, addDoc } from "firebase/firestore";
import { useNickname } from "../../../context/context";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASE_WIDTH = 400; 
const scaleFactor = SCREEN_WIDTH / BASE_WIDTH;

Matter.Resolver._restingThresh = 0.001;
Matter.Resolver._positionDampen = 0.01;
Matter.Resolver._positionWarming = 0.01;
Matter.Resolver._frictionNormalMultiplier = 1.0;

const getRandomIndices = (count, total, excludeSet = new Set()) => {
  const indices = new Set();
  while (indices.size < count) {
    const idx = Math.floor(Math.random() * total);
    if (!excludeSet.has(idx)) {
      indices.add(idx);
    }
  }
  return indices;
};

const setupWorld = (level = 1) => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  engine.world.gravity.y = 0;

  const ball = Matter.Bodies.circle(
    200 * scaleFactor,
    520 * scaleFactor,
    10 * scaleFactor,
    {
      isStatic: true,
      label: "ball",
      restitution: 1.0,
      friction: 0,
      frictionAir: 0,
      inertia: Infinity,
      isStatic: false,
      collisionFilter: { group: -1 },
    }
  );

  const paddle = Matter.Bodies.rectangle(
    200 * scaleFactor,
    600 * scaleFactor,
    100 * scaleFactor,
    20 * scaleFactor,
    {
      isStatic: true,
      collisionFilter: { category: 0x0002, mask: 0x0004 },
    }
  );

  const wallLeft = Matter.Bodies.rectangle(
    0,
    300 * scaleFactor,
    20 * scaleFactor,
    600 * scaleFactor,
    { isStatic: true }
  );
  const wallRight = Matter.Bodies.rectangle(
    SCREEN_WIDTH,
    300 * scaleFactor,
    20 * scaleFactor,
    600 * scaleFactor,
    { isStatic: true }
  );
  const ceiling = Matter.Bodies.rectangle(
    SCREEN_WIDTH / 2,
    0,
    SCREEN_WIDTH,
    20 * scaleFactor,
    { isStatic: true }
  );

  const bricks = [];
  const brickCols = 6;
  const brickRows = 7;
  const brickWidth = 50 * scaleFactor;
  const brickHeight = 30 * scaleFactor;
  const spacingX = 8 * scaleFactor;
  const spacingY = 10 * scaleFactor;

  const totalBrickWidth = brickCols * brickWidth + (brickCols - 1) * spacingX;
  const startX = (SCREEN_WIDTH - totalBrickWidth) / 2;
  const totalBricks = brickCols * brickRows;

  const doubleCount = Math.floor(Math.random() * (8 - 2 + 1)) + 2;
  const whiteCount = Math.floor(Math.random() * 1) + 3; 

  const whiteSpecialIndices = getRandomIndices(whiteCount, totalBricks);
  const doubleSpecialIndices = getRandomIndices(
    doubleCount,
    totalBricks,
    whiteSpecialIndices
  );

  for (let i = 0; i < brickCols; i++) {
    for (let j = 0; j < brickRows; j++) {
      const x = startX + i * (brickWidth + spacingX) + brickWidth / 2;
      const y = 100 * scaleFactor + j * (brickHeight + spacingY);
      const index = i * brickRows + j;

      let brickType = "normal";
      let hits = 1;
      if (whiteSpecialIndices.has(index)) {
        brickType = "white";
        hits = 1;
      } else if (doubleSpecialIndices.has(index)) {
        brickType = "double";
        hits = 2;
      }

      const brick = Matter.Bodies.rectangle(x, y, brickWidth, brickHeight, {
        label: `brick_${i}_${j}`,
        isStatic: true,
        collisionFilter: { category: 0x0008, mask: 0x0004 },
      });
      bricks.push({ body: brick, hits, brickType });
    }
  }

  Matter.World.add(
    world,
    [wallLeft, wallRight, ceiling, ball, paddle, ...bricks.map((b) => b.body)]
  );
  return { engine, world, ball, paddle, bricks, level, wallLeft, wallRight, ceiling };
};

export default function BrickBreaker() {
  const navigation = useNavigation();
  const { nickname } = useNickname();

  const gameEngine = useRef(null);
  const initialState = setupWorld();
  const [gameState, setGameState] = useState(initialState);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [levelCleared, setLevelCleared] = useState(false);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (event, gesture) => {
          const minX = 50 * scaleFactor;
          const maxX = SCREEN_WIDTH - 50 * scaleFactor;
          if (gameState.paddle) {
            Matter.Body.setPosition(gameState.paddle, {
              x: Math.min(Math.max(gesture.moveX, minX), maxX),
              y: 600 * scaleFactor,

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

  const nextLevel = () => {
    const newLevel = gameState.level + 1;
    const newGameState = setupWorld(newLevel);
    setGameState(newGameState);
    setGameOver(false);
    setGameStarted(false);
    setLevelCleared(false);

    setTimeout(() => {
      gameEngine.current.swap({
        physics: {
          engine: newGameState.engine,
          world: newGameState.world,
        },
        ball: {
          body: newGameState.ball,
          renderer: Ball,
          themeIndex: gameState.level,
        },
        paddle: { body: newGameState.paddle, renderer: Paddle },
        wallLeft: { body: newGameState.wallLeft },
        wallRight: { body: newGameState.wallRight },
        ceiling: { body: newGameState.ceiling },
        ...newGameState.bricks.reduce((acc, brickObj, index) => {
          acc[`brick_${index}`] = {
            body: brickObj.body,
            renderer: Brick,
            hits: brickObj.hits,
            brickType: brickObj.brickType,
            damaged: false,
          };
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
                  physics: {
                    engine: newGameState.engine,
                    world: newGameState.world,
                  },
                  ball: { body: newGameState.ball, renderer: Ball },
                  paddle: { body: newGameState.paddle, renderer: Paddle },
                  wallLeft: { body: newGameState.wallLeft },
                  wallRight: { body: newGameState.wallRight },
                  ceiling: { body: newGameState.ceiling },
                  ...newGameState.bricks.reduce((acc, brickObj, index) => {
                    acc[`brick_${index}`] = {
                      body: brickObj.body,
                      renderer: Brick,
                      hits: brickObj.hits,
                      brickType: brickObj.brickType,
                      damaged: false,
                    };
                    return acc;
                  }, {}),
                });
              }, 50);
            }}
          />
          <Button title="Results" onPress={() => storeResult()} />
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
              const baseSpeed = 3 * scaleFactor;
              const fixedSpeed = baseSpeed + gameState.level;
              Matter.Body.setVelocity(gameState.ball, { x: 0, y: -fixedSpeed });
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
          physics: {
            engine: gameState.engine,
            world: gameState.world,
          },
          ball: {
            body: gameState.ball,
            renderer: Ball,
            themeIndex: gameState.level,
          },
          paddle: { body: gameState.paddle, renderer: Paddle },
          wallLeft: { body: gameState.wallLeft },
          wallRight: { body: gameState.wallRight },
          ceiling: { body: gameState.ceiling },
          ...gameState.bricks.reduce((acc, brickObj, index) => {
            acc[`brick_${index}`] = {
              body: brickObj.body,
              renderer: Brick,
              hits: brickObj.hits,
              brickType: brickObj.brickType,
              damaged: false,
            };
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
  container: { flex: 1, backgroundColor: "rgb(192, 253, 111)" },
  gameContainer: { flex: 1 },
  score: { color: "white", fontSize: 20, textAlign: "center", marginTop: 60 },
  overlay: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 10,
    height: "120%",
    width: "100%",
  },
  gameOverText: { color: "white", fontSize: 30, marginBottom: 20 },
});
