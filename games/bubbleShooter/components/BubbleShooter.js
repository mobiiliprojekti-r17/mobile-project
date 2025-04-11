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

// Ammuttava pallo spawnataan y = height - 200.
// Pelin häviämisehto: kun staattisen pallon alareuna tunkeutuu ampumisalueelle.
const SHOOTER_BALL_Y = height - 200;

const BubbleShooter = ({ navigation }) => {
  const { engine, world, ceiling } = createPhysics(width, height);
  const shooterBall = useRef(null);
  const [ballPosition, setBallPosition] = useState({ x: width / 2, y: SHOOTER_BALL_Y });
  const [staticBalls, setStaticBalls] = useState([]);
  const staticBallsRef = useRef([]);
  const [ballsInitialized, setBallsInitialized] = useState(false);
  const [isBallAtCenter, setIsBallAtCenter] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  // Pisteet seurataan sekä tilana että ref‑muuttujana
  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);
  // Loppupelilogiikka aktivoituu vain kerran
  const gameOverTriggered = useRef(false);
  const route = useRoute();
  const { nickname } = useNickname();
  
  // Tallennetaan requestAnimationFrame:in id, jotta se voidaan perua
  const rafIdRef = useRef(null);

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
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    // Määritellään collisionStart-kuuntelija omaksi funktioksi, jotta se voidaan myöhemmin poistaa.
    const collisionHandler = (event) => {
      for (let { bodyA, bodyB } of event.pairs) {
        if (!shooterBall.current) break;
        const shooter = shooterBall.current;
        let other = bodyA === shooter ? bodyB : bodyB === shooter ? bodyA : null;

        if (other) {
          // Kun ammuttu pallo osuu staattiseen palloon:
          const isStaticBall = staticBallsRef.current.some((b) => b.id === other.id);
          if (isStaticBall) {
            Matter.Body.setVelocity(shooter, { x: 0, y: 0 });
            Matter.Body.setStatic(shooter, true);

            // Asetetaan pallo ruudukkoon snapToGrid-funktion avulla.
            const snappedCoords = snapToGrid(shooter, width, 9);
            Matter.Body.setPosition(shooter, { x: snappedCoords.x, y: snappedCoords.y });

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
              setStaticBalls(prev => [...prev, shooter]);
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

        // Törmäys kattoon:
        if ((bodyA === shooter && bodyB === ceiling) || (bodyB === shooter && bodyA === ceiling)) {
          Matter.Body.setVelocity(shooter, { x: 0, y: 0 });
          Matter.Body.setStatic(shooter, true);
          const snappedCoords = snapToGrid(shooter, width, 9);
          Matter.Body.setPosition(shooter, { x: snappedCoords.x, y: snappedCoords.y });
          setStaticBalls(prev => [...prev, shooter]);

          const cluster = findClusterAndRemove(staticBallsRef.current, shooter);
          if (cluster.length > 0) {
            cluster.forEach(ball => Matter.World.remove(world, ball));
            setStaticBalls(prev => prev.filter(ball => !cluster.includes(ball)));
            setScore(prev => {
              const newScore = prev + cluster.length * 10;
              scoreRef.current = newScore;
              return newScore;
            });
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
      updatePhysics(engine);

      // Päivitetään ammuttavan pallon sijainti renderöintiä varten.
      if (shooterBall.current) {
        const { x, y } = shooterBall.current.position;
        setBallPosition({ x, y });
      }

      // --- PELIN PÄÄTTYMISEN TARKASTUS ---
      if (!gameOverTriggered.current) {
        for (let ball of staticBallsRef.current) {
          if (ball.position.y + BALL_RADIUS >= SHOOTER_BALL_Y) {
            gameOverTriggered.current = true;
            setGameOver(true);
            clearInterval(timerRef.current);
            storeShooterResults();
            break;
          }
        }
      }
      
      rafIdRef.current = requestAnimationFrame(update);
    };

    update();

    // Cleanup: poistetaan timer, animation frame ja Matter.Events-kuuntelija komponentin unmount-vaiheessa.
    return () => {
      clearInterval(timerRef.current);
      Matter.Events.off(engine, 'collisionStart', collisionHandler);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, []);

  // Tarkistetaan myös voittotilanne, eli jos kaikki pallot poistuvat.
  useEffect(() => {
    if (ballsInitialized && staticBalls.length === 0 && !gameOverTriggered.current) {
      gameOverTriggered.current = true;
      setGameOver(true);
      clearInterval(timerRef.current);
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
      <View style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Ionicons name="home" size={32} color="black" />
        </TouchableOpacity>
      </View>
      
      <TouchableWithoutFeedback onPress={handleTouch}>
        <View style={shooterStyles.shooterGameContainer}>
          <Text style={shooterStyles.shooterScoreText}>Score: {score} | Time: {time}s</Text>
          {staticBalls.map(ball => (
            <Ball key={ball.id} x={ball.position.x} y={ball.position.y} size={40} color={ball.color} />
          ))}
          <Ball x={ballPosition.x} y={ballPosition.y} size={40} color={shooterBall.current?.color || 'blue'} />
        </View>
      </TouchableWithoutFeedback>
    </>
  );
};

export default BubbleShooter;
