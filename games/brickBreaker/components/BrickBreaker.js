


import React, { useRef, useState } from "react";
import { View, StyleSheet, PanResponder, Text, Button } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import { Paddle, Ball, Brick } from "./BrickBreakRender";
import { Physics } from "../utils/BrickPhysics";

Matter.Resolver._restingThresh = 0.001;
Matter.Resolver._positionDampen = 0.01;
Matter.Resolver._positionWarming = 0.01;
Matter.Resolver._frictionNormalMultiplier = 1.0;

const setupWorld = (level = 1) => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  
  engine.world.gravity.y = 0;
//----------------------------------------------------------------------------------
//Siirretäänkö brickbreakrenderers.js
  const ball = Matter.Bodies.circle(200, 300, 10, {
    label: "ball",
    restitution: 1.0,
    friction: 0,
    frictionAir: 0,
    inertia: Infinity,
    isStatic: false,
    collisionFilter: { group: -1 }, 
  });
  

  ball.plugin = { continuous: true }; 
  
  Matter.Body.set(ball, {
    slop: 0, 
    timeScale: 1,
  });

  const paddle = Matter.Bodies.rectangle(200, 550, 100, 20, { 
    isStatic: true,
    collisionFilter: { category: 0x0002, mask: 0x0004 }
  });

  const wallLeft = Matter.Bodies.rectangle(0, 300, 20, 600, { isStatic: true });  
  const wallRight = Matter.Bodies.rectangle(400, 300, 20, 600, { isStatic: true }); 
  const ceiling = Matter.Bodies.rectangle(200, 0, 400, 20, { isStatic: true }); 

  Matter.World.add(world, [wallLeft, wallRight, ceiling]);
  Matter.Body.setVelocity(ball, { x: 5, y: -5 });

  const bricks = [];
  const brickCols = 6;
  const brickRows = 6;
  const brickWidth = 50;
  const brickHeight = 30;
  const spacingX = 8;
  const spacingY = 10;
  
  const totalBrickWidth = brickCols * brickWidth + (brickCols - 1) * spacingX;
  const startX = (400 - totalBrickWidth) / 2;
  
  const specialBrickIndex = Math.floor(Math.random() * (brickCols * 4)); 

  for (let i = 0; i < brickCols; i++) {
    for (let j = 0; j < brickRows; j++) {
      const x = startX + i * (brickWidth + spacingX) + brickWidth / 2;
      const y = 100 + j * (brickHeight + spacingY);
      
      const index = i * brickRows + j;
      const isSpecial = index === specialBrickIndex && j < 4;

      const brick = Matter.Bodies.rectangle(
        x,
        y,
        brickWidth,
        brickHeight,
        {
          label: isSpecial ? `brick_special_${i}_${j}` : `brick_${i}_${j}`,
          isStatic: true,
          collisionFilter: { category: 0x0008, mask: 0x0004 }
        }
      );

      bricks.push(brick);
    }
  }

  Matter.World.add(world, [ball, paddle]);
  return { engine, world, ball, paddle, bricks, level, wallLeft, wallRight, ceiling };
};
//--------------------------------------------------------------------------------------------
export default function brickBreaker() {
  const gameEngine = useRef(null);
  const [gameState, setGameState] = useState(setupWorld());
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        const maxX = 400 - 50;
        const minX = 50;
        Matter.Body.setPosition(gameState.paddle, {
          x: Math.min(Math.max(gesture.moveX, minX), maxX),
          y: 550
        });
      },
    })
  ).current;


const Restart = () => {
    const newGameState = setupWorld(1); 
    setGameState(newGameState);
    setGameOver(false);
    setScore(0);
    
    if (gameEngine.current) {
      gameEngine.current.stop(); 
    
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
  
        gameEngine.current.start(); 
      }, 100); 
    }
  };
  


  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Text style={styles.score}>Pisteet: {score} | Taso: {gameState.level}</Text>
      {gameOver && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>Peli päättyi!</Text>
          <Button title="Restart" onPress={Restart} />
        </View>
      )}

      
      <GameEngine
        ref={gameEngine}
        style={styles.gameContainer}
        systems={[Physics]}
        entities={{
          physics: { engine: gameState.engine, world: gameState.world },
          ball: { body: gameState.ball, renderer: Ball },
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
            setGameOver(true);
            gameEngine.current.stop(); 
          }
        }}
        
      />
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black" },
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
  },
  gameOverText: {
    color: "white",
    fontSize: 30,
    marginBottom: 20,
  },
});

