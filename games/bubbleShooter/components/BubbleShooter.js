import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableWithoutFeedback, Dimensions, Text, TouchableOpacity } from 'react-native';
import Matter from 'matter-js';
import {
  createPhysics,
  createShooterBall,
  createStaticBalls,
  updatePhysics,
  getRandomPastelColor,
  findClusterAndRemove,
  findFloatingBalls,
  getAvailableColors,
  snapToGrid
} from '../utils/shooterPhysics';
import Ball from './ShooterBall';
import { useRoute } from "@react-navigation/native";
import { db } from "../../../firebase/Config";
import { collection, addDoc } from "firebase/firestore";
import shooterStyles from '../styles/shooterStyles';
import { useNickname } from '../../../context/context';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const BALL_RADIUS = 20;
const SHOOTER_BALL_Y = height - 200;

// Gridin perusparametrit
const topOffset = 80;
const horizontalSpacing = BALL_RADIUS * 2;
const verticalSpacing = BALL_RADIUS * Math.sqrt(3);
const numCols = 9;

const BubbleShooter = ({ navigation }) => {
  const { engine, world, ceiling } = createPhysics(width, height);
  const shooterBall = useRef(null);
  // Laukaisulaskuri kasvatetaan, kun laukaus ei tuota poistuvaa klusteria.
  const shotCounterRef = useRef(0);
  const [ballPosition, setBallPosition] = useState({ x: width / 2, y: SHOOTER_BALL_Y });
  const [staticBalls, setStaticBalls] = useState([]);
  const staticBallsRef = useRef([]);
  const [ballsInitialized, setBallsInitialized] = useState(false);
  const [isBallAtCenter, setIsBallAtCenter] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const gameOverTriggered = useRef(false);
  const route = useRoute();
  const { nickname } = useNickname();
  const rafIdRef = useRef(null);

  // Muuntaa ruudukon koordinaateiksi
  const gridToPosition = (row, col) => {
    let baseOffset = (width - (numCols * horizontalSpacing)) / 2;
    if (row % 2 !== 0) {
      baseOffset += horizontalSpacing / 2;
    }
    return { x: baseOffset + col * horizontalSpacing, y: topOffset + row * verticalSpacing };
  };

  // Palauttaa ruudukon rivin indeksin annetusta y-arvosta
  const getGridRow = (y) => Math.round((y - topOffset) / verticalSpacing);

  // Häviämisehto: jos jonkin pallon ruudukon rivi ylittää sallitun rajan.
  const MAX_ROW = Math.floor((SHOOTER_BALL_Y - topOffset - BALL_RADIUS) / verticalSpacing);

  useEffect(() => {
    staticBallsRef.current = staticBalls;
  }, [staticBalls]);

  // addRow: repositionoi olemassa olevat pallot (gridRow-arvoa kasvatetaan) ja lisää uuden yläreunan.
  // Lisäksi poistaa "leijuvat" pallot.
  const addRow = () => {
    setStaticBalls(prevBalls => {
      const repositionedBalls = prevBalls.map(ball => {
        if (typeof ball.gridRow !== 'number' || typeof ball.gridCol !== 'number') {
          const snappedCoords = snapToGrid(ball, width, numCols);
          Matter.Body.setPosition(ball, { x: snappedCoords.x, y: snappedCoords.y });
          const row = Math.round((snappedCoords.y - topOffset) / verticalSpacing);
          let baseOffset = (width - (numCols * horizontalSpacing)) / 2;
          if (row % 2 !== 0) baseOffset += horizontalSpacing / 2;
          const col = Math.round((snappedCoords.x - baseOffset) / horizontalSpacing);
          ball.gridRow = row;
          ball.gridCol = col;
        }
        ball.gridRow += 1;
        const newPos = gridToPosition(ball.gridRow, ball.gridCol);
        Matter.Body.setPosition(ball, newPos);
        return ball;
      });

      const newRowBalls = [];
      for (let col = 0; col < numCols; col++) {
        const pos = gridToPosition(0, col);
        const newBall = Matter.Bodies.circle(pos.x, pos.y, BALL_RADIUS, {
          isStatic: true,
          restitution: 0,
          collisionFilter: { category: 0x0001, mask: 0x0002 },
        });
        newBall.color = getRandomPastelColor();
        newBall.id = Matter.Common.nextId();
        newBall.gridRow = 0;
        newBall.gridCol = col;
        Matter.World.add(world, newBall);
        newRowBalls.push(newBall);
      }

      let combined = [...newRowBalls, ...repositionedBalls];
      const floating = findFloatingBalls(combined);
      floating.forEach(ball => Matter.World.remove(world, ball));
      combined = combined.filter(ball => !floating.includes(ball));
      return combined;
    });
  };

  // Tarkistetaan törmäystilanteet: sekä osuma staattiseen palloon että kattoon
  useEffect(() => {
    initShooterBall();
    const initialStaticBalls = createStaticBalls(world, 9, numCols, width);
    setStaticBalls(initialStaticBalls);
    setBallsInitialized(true);

    const collisionHandler = (event) => {
      for (let { bodyA, bodyB } of event.pairs) {
        if (!shooterBall.current) break;
        const shooter = shooterBall.current;
        let other = bodyA === shooter ? bodyB : bodyB === shooter ? bodyA : null;

        if (other) {
          const isStaticBall = staticBallsRef.current.some((b) => b.id === other.id);
          if (isStaticBall) {
            // Aseta ohjauspallo pysähtymään ja snapataan ruudukkoon
            Matter.Body.setVelocity(shooter, { x: 0, y: 0 });
            Matter.Body.setStatic(shooter, true);

            const snappedCoords = snapToGrid(shooter, width, numCols);
            Matter.Body.setPosition(shooter, { x: snappedCoords.x, y: snappedCoords.y });
            const row = Math.round((snappedCoords.y - topOffset) / verticalSpacing);
            let baseOffset = (width - (numCols * horizontalSpacing)) / 2;
            if (row % 2 !== 0) baseOffset += horizontalSpacing / 2;
            const col = Math.round((snappedCoords.x - baseOffset) / horizontalSpacing);
            shooter.gridRow = row;
            shooter.gridCol = col;

            const cluster = findClusterAndRemove(staticBallsRef.current, shooter);

            if (cluster.length > 0) {
              cluster.forEach(ball => Matter.World.remove(world, ball));
              setStaticBalls(prev => prev.filter(ball => !cluster.includes(ball)));
              setScore(prev => {
                const newScore = prev + cluster.length * 10;
                scoreRef.current = newScore;
                return newScore;
              });
            } else {
              // Kasvata laukaisulaskuria – nyt aina attachataan ohjauspallo
              shotCounterRef.current += 1;
              // Liitetään ohjauspallo aina ruudukkoon
              setStaticBalls(prev => [...prev, shooter]);
              if (shotCounterRef.current >= 5) {
                // Kun viides laukaisu on tehty, resetataan laskuri, lisätään uusi rivi ja repositionoidaan pallot.
                shotCounterRef.current = 0;
                addRow();
              }
            }

            // Poistetaan mahdolliset "floating" pallot
            const updatedBalls = staticBallsRef.current.filter(ball => !cluster.includes(ball));
            const floatingBalls = findFloatingBalls(updatedBalls);
            if (floatingBalls.length > 0) {
              floatingBalls.forEach(ball => Matter.World.remove(world, ball));
              setStaticBalls(prev =>
                prev.filter(ball => !floatingBalls.includes(ball))
              );
              setScore(prev => {
                const newScore = prev + floatingBalls.length * 15;
                scoreRef.current = newScore;
                return newScore;
              });
            }

            shooterBall.current = null;
            resetShooterBall();
            break;
          }
        }

        // Törmäys kattoon
        if ((bodyA === shooter && bodyB === ceiling) || (bodyB === shooter && bodyA === ceiling)) {
          Matter.Body.setVelocity(shooter, { x: 0, y: 0 });
          Matter.Body.setStatic(shooter, true);
          const snappedCoords = snapToGrid(shooter, width, numCols);
          Matter.Body.setPosition(shooter, { x: snappedCoords.x, y: snappedCoords.y });
          const row = Math.round((snappedCoords.y - topOffset) / verticalSpacing);
          let baseOffset = (width - (numCols * horizontalSpacing)) / 2;
          if (row % 2 !== 0) baseOffset += horizontalSpacing / 2;
          const col = Math.round((snappedCoords.x - baseOffset) / horizontalSpacing);
          shooter.gridRow = row;
          shooter.gridCol = col;

          const cluster = findClusterAndRemove(staticBallsRef.current, shooter);
          if (cluster.length > 0) {
            cluster.forEach(ball => Matter.World.remove(world, ball));
            setStaticBalls(prev => prev.filter(ball => !cluster.includes(ball)));
            setScore(prev => {
              const newScore = prev + cluster.length * 10;
              scoreRef.current = newScore;
              return newScore;
            });
          } else {
            shotCounterRef.current += 1;
            setStaticBalls(prev => [...prev, shooter]);
            if (shotCounterRef.current >= 5) {
              shotCounterRef.current = 0;
              addRow();
            }
          }
          
          const updatedBalls = staticBallsRef.current.filter(ball => !cluster.includes(ball));
          const floatingBalls = findFloatingBalls(updatedBalls);
          if (floatingBalls.length > 0) {
            floatingBalls.forEach(ball => Matter.World.remove(world, ball));
            setStaticBalls(prev => prev.filter(ball => !floatingBalls.includes(ball)));
            setScore(prev => {
              const newScore = prev + floatingBalls.length * 15;
              scoreRef.current = newScore;
              return newScore;
            });
          }
          shooterBall.current = null;
          resetShooterBall();
          break;
        }
      }
    };

    Matter.Events.on(engine, 'collisionStart', collisionHandler);

    const update = () => {
      updatePhysics(engine, 33);

      if (shooterBall.current) {
        const { x, y } = shooterBall.current.position;
        setBallPosition({ x, y });
      }

      if (!gameOverTriggered.current) {
        for (let ball of staticBallsRef.current) {
          if (getGridRow(ball.position.y) >= MAX_ROW) {
            gameOverTriggered.current = true;
            setGameOver(true);
            storeShooterResults();
            break;
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(update);
    };

    update();

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      Matter.Events.off(engine, 'collisionStart', collisionHandler);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  useEffect(() => {
    if (ballsInitialized && staticBalls.length === 0 && !gameOverTriggered.current) {
      gameOverTriggered.current = true;
      setGameOver(true);
      storeShooterResults();
    }
  }, [staticBalls, ballsInitialized]);

  const initShooterBall = () => {
    const availableColors = getAvailableColors(staticBallsRef.current);
    const color = availableColors.length > 0 
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : getRandomPastelColor();

    shooterBall.current = createShooterBall(world, width / 2, SHOOTER_BALL_Y, BALL_RADIUS, color);
    Matter.Body.setStatic(shooterBall.current, true);
  };

  const resetShooterBall = () => {
    const availableColors = getAvailableColors(staticBallsRef.current);
    const color = availableColors.length > 0 
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : getRandomPastelColor();

    const newBall = createShooterBall(world, width / 2, SHOOTER_BALL_Y, BALL_RADIUS, color);
    Matter.Body.setStatic(newBall, true);
    shooterBall.current = newBall;
    setBallPosition({ x: newBall.position.x, y: newBall.position.y });
    setIsBallAtCenter(true);
  };

  const handleTouch = (event) => {
    if (!isBallAtCenter || gameOver) return;
    
    const touchX = event.nativeEvent.pageX;
    const touchY = event.nativeEvent.pageY;
    const directionX = touchX - shooterBall.current.position.x;
    const directionY = touchY - shooterBall.current.position.y;
    const angle = Math.atan2(directionY, directionX);
    const speed = 15;
    const normalizedX = Math.cos(angle) * speed;
    const normalizedY = Math.sin(angle) * speed;

    Matter.Body.setStatic(shooterBall.current, false);
    Matter.Body.set(shooterBall.current, { restitution: 1, friction: 0, frictionAir: 0 });
    Matter.Body.setVelocity(shooterBall.current, { x: normalizedX, y: normalizedY });

    setIsBallAtCenter(false);
  };

  const storeShooterResults = async () => {
    try {
      await addDoc(collection(db, "ShooterResults"), {
        Nickname: nickname,
        score: scoreRef.current,
      });
      console.log("Result stored in Firestore.");
    } catch (error) {
      console.error("Error storing result: ", error);
    }
    navigation.navigate("ShooterGameOver", {
      nickname,
      finalScore: scoreRef.current,
    });
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={handleTouch}>
        <View style={shooterStyles.shooterGameContainer}>
          <Text style={shooterStyles.shooterScoreText}>Score: {score}</Text>
          {staticBalls.map(ball => (
            <Ball key={ball.id} x={ball.position.x} y={ball.position.y} size={40} color={ball.color} />
          ))}
          <Ball x={ballPosition.x} y={ballPosition.y} size={40} color={shooterBall.current?.color || 'blue'} />
        </View>
      </TouchableWithoutFeedback>
      <View style={shooterStyles.shooterHomeButtonContainer}>
        <TouchableOpacity onPress={() => navigation.replace('Home')}>
          <Ionicons name="home" style={shooterStyles.shooterHomeIcon} />
        </TouchableOpacity>
      </View>
    </>
  );
};

export default BubbleShooter;
