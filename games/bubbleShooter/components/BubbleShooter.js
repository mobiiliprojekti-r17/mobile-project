import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableWithoutFeedback, Dimensions, StyleSheet, Text } from 'react-native';
import Matter from 'matter-js';
import {
  createPhysics,
  createShooterBall,
  createStaticBalls,
  updatePhysics,
  getRandomPastelColor,
  findClusterAndRemove,
  findFloatingBalls
} from '../utils/shooterPhysics';
import Ball from './ShooterBall';
import { useNavigation, useRoute } from "@react-navigation/native";
import { db } from "../../../firebase/Config";
import { collection, getDocs, query, orderBy, addDoc } from "firebase/firestore";
import shooterStyles from '../styles/shooterStyles';
import { useNickname } from '../../../context/context';

const { width, height } = Dimensions.get('window');
const BALL_RADIUS = 20;

const BubbleShooter = ({ navigation }) => {
  const { engine, world, ceiling } = createPhysics(width, height);
  const shooterBall = useRef(null);
  const [ballPosition, setBallPosition] = useState({ x: width / 2, y: height - 200 });
  const [staticBalls, setStaticBalls] = useState([]);
  const staticBallsRef = useRef([]);
  const [ballsInitialized, setBallsInitialized] = useState(false);
  const [isBallAtCenter, setIsBallAtCenter] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);
  const route = useRoute();
  const { nickname } = useNickname(); 

  useEffect(() => {
    staticBallsRef.current = staticBalls;
  }, [staticBalls]);

  useEffect(() => {
    initShooterBall();
    const initialStaticBalls = createStaticBalls(world, 6, 9, width);
    setStaticBalls(initialStaticBalls);
    setBallsInitialized(true);

    if (!gameOver) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    Matter.Events.on(engine, 'collisionStart', (event) => {
      for (let { bodyA, bodyB } of event.pairs) {
        if (!shooterBall.current) break;

        const shooter = shooterBall.current;
        let other = bodyA === shooter ? bodyB : bodyB === shooter ? bodyA : null;

        if (other) {
          const isStaticBall = staticBallsRef.current.some((b) => b.id === other.id);
          if (isStaticBall) {
            Matter.Body.setVelocity(shooter, { x: 0, y: 0 });
            Matter.Body.setStatic(shooter, true);

            const dx = shooter.position.x - other.position.x;
            const dy = shooter.position.y - other.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist !== 0) {
              const targetDistance = BALL_RADIUS * 2;
              const factor = targetDistance / dist;
              const newX = other.position.x + dx * factor;
              const newY = other.position.y + dy * factor;
              Matter.Body.setPosition(shooter, { x: newX, y: newY });
            }

            const cluster = findClusterAndRemove(staticBallsRef.current, shooter);

            if (cluster.length > 0) {
              cluster.forEach(ball => Matter.World.remove(world, ball));
              setStaticBalls(prev => prev.filter(ball => !cluster.includes(ball)));
              setScore(prev => prev + cluster.length * 10);
            } else {
              setStaticBalls(prev => [...prev, shooter]);
            }

            // Leijuvien pallojen tarkistus ja poisto
            const updatedBalls = staticBallsRef.current.filter(ball => !cluster.includes(ball));
            const floatingBalls = findFloatingBalls(updatedBalls);
            if (floatingBalls.length > 0) {
              floatingBalls.forEach(ball => Matter.World.remove(world, ball));
              setStaticBalls(prev => prev.filter(ball => !floatingBalls.includes(ball)));
              setScore(prev => prev + floatingBalls.length * 5);
            }

            shooterBall.current = null;
            resetShooterBall();
            break;
          }
        }

        if ((bodyA === shooter && bodyB === ceiling) || (bodyB === shooter && bodyA === ceiling)) {
          Matter.World.remove(world, shooter);
          shooterBall.current = null;
          resetShooterBall();
          break;
        }
      }
    });

    const update = () => {
      updatePhysics(engine);
      if (shooterBall.current) {
        const { x, y } = shooterBall.current.position;
        setBallPosition({ x, y });
      }
      requestAnimationFrame(update);
    };

    update();
  }, []);

  useEffect(() => {
    if (ballsInitialized && staticBalls.length === 0 && !gameOver) {
      setGameOver(true);
      clearInterval(timerRef.current);
      storeShooterResults();
    }
  }, [staticBalls, ballsInitialized]);

  const initShooterBall = () => {
    shooterBall.current = createShooterBall(world, width / 2, height - 200, BALL_RADIUS, getRandomPastelColor());
    Matter.Body.setStatic(shooterBall.current, true);
  };

  const resetShooterBall = () => {
    const newBall = createShooterBall(world, width / 2, height - 200, BALL_RADIUS, getRandomPastelColor());
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
        score: score,
      });
      console.log("Result stored in Firestore.");
    } catch (error) {
      console.error("Error storing result: ", error);
    }
    navigation.navigate("ShooterGameOver", {
      nickname,
      finalScore: score,
    });
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View style={shooterStyles.gameContainer}>
        <Text style={shooterStyles.scoreText}>Pisteet: {score} | Aika: {time}s</Text>
        {staticBalls.map(ball => (
          <Ball key={ball.id} x={ball.position.x} y={ball.position.y} size={40} color={ball.color} />
        ))}
        <Ball x={ballPosition.x} y={ballPosition.y} size={40} color={shooterBall.current?.color || 'blue'} />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default BubbleShooter;
