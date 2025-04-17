import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { View, TouchableWithoutFeedback, Dimensions, Text, TouchableOpacity, Image } from 'react-native';
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
  snapToGrid,
  gridToPosition,
  getGridRow,
  addRowsToGrid
} from '../utils/shooterPhysics';
import Ball from './ShooterBall';
import AnimatedBall from './ShooterBallAnimation';
import ScorePopUp from './ScorePop';
import { useRoute } from "@react-navigation/native";
import { db } from "../../../firebase/Config";
import { collection, addDoc } from "firebase/firestore";
import shooterStyles from '../styles/shooterStyles';
import { useNickname } from '../../../context/context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ShooterArrow from './ShooterArrow';

const { width, height } = Dimensions.get('window');
const BALL_RADIUS = 20;
const SHOOTER_BALL_Y = height - 200;
const topOffset = 80;
const numCols = 9;

const BubbleShooter = ({ navigation }) => {
  const soundRef = useRef(null);
  const lastPopSoundTime = useRef(0);
  const shooterBall = useRef(null);
  const staticBallsRef = useRef([]);
  const scoreRef = useRef(0);
  const shotCounterRef = useRef(0);
  const gameOverTriggered = useRef(false);
  const rafIdRef = useRef(null);
  const aggregatedTimeoutRef = useRef(null);

  const engineRef = useRef(null);
  const worldRef = useRef(null);
  const ceilingRef = useRef(null);

  const [ballPosition, setBallPosition] = useState({ x: width / 2, y: SHOOTER_BALL_Y });
  const [staticBalls, setStaticBalls] = useState([]);
  const [ballsInitialized, setBallsInitialized] = useState(false);
  const [isBallAtCenter, setIsBallAtCenter] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [poppedBalls, setPoppedBalls] = useState([]);
  const [aggregatedPopup, setAggregatedPopup] = useState(null);

  const [aimAngle, setAimAngle] = useState(0);
  const [isAiming, setIsAiming] = useState(false);
  const [touchPosition, setTouchPosition] = useState(null);
  const [touchStart, setTouchStart] = useState(null);
  const [touchCurrent, setTouchCurrent] = useState(null);
  const [canShoot, setCanShoot] = useState(true);




  const route = useRoute();
  const { nickname } = useNickname();

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(require('../assets/bubbleSound.mp3'));
        soundRef.current = sound;
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    };
    loadSound();

    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  const playPopSound = async () => {
    const now = Date.now();
    if (now - lastPopSoundTime.current < 100) return;
    lastPopSoundTime.current = now;
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const addAggregatedPopup = (points, x, y) => {
    setAggregatedPopup(prev => {
      if (prev) {
        const newPoints = prev.points + points;
        const avgX = (prev.x * prev.points + x * points) / newPoints;
        const avgY = (prev.y * prev.points + y * points) / newPoints;
        return { ...prev, points: newPoints, x: avgX, y: avgY };
      }
      return { id: `${Date.now()}-${Math.random()}`, points, x, y };
    });
    if (aggregatedTimeoutRef.current) clearTimeout(aggregatedTimeoutRef.current);
    aggregatedTimeoutRef.current = setTimeout(() => setAggregatedPopup(null), 1000);
  };
  

  useEffect(() => {
    staticBallsRef.current = staticBalls;
  }, [staticBalls]);

  const initShooterBall = () => {
    const availableColors = getAvailableColors(staticBallsRef.current);
    const color = availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : getRandomPastelColor();

    shooterBall.current = createShooterBall(worldRef.current, width / 2, SHOOTER_BALL_Y, BALL_RADIUS, color);
    Matter.Body.setStatic(shooterBall.current, true);
    setBallPosition({ x: shooterBall.current.position.x, y: shooterBall.current.position.y });
  };

  const resetShooterBall = () => {
    const availableColors = getAvailableColors(staticBallsRef.current);
    const color = availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : getRandomPastelColor();

    const newBall = createShooterBall(worldRef.current, width / 2, SHOOTER_BALL_Y, BALL_RADIUS, color);
    Matter.Body.setStatic(newBall, true);
    shooterBall.current = newBall;
    setBallPosition({ x: newBall.position.x, y: newBall.position.y });
    setIsBallAtCenter(true);
    setCanShoot(true);
  };

  const addRows = (numRows = 1) => {
    setStaticBalls(prevBalls => {
      return addRowsToGrid({
        staticBalls: prevBalls,
        numRows,
        world: worldRef.current,
        numCols,
        width,
      });
    });
  };

  const handleTouch = useCallback((event) => {
    if (
      gameOver ||
      !canShoot || // << uusi ehto
      !shooterBall.current ||
      !shooterBall.current.isStatic
    ) {
      return;
    }
  
    setCanShoot(false); // estetään uudet laukaukset ennen resettiä
  
    const touchX = event.nativeEvent.pageX;
    const touchY = event.nativeEvent.pageY;
    const directionX = touchX - shooterBall.current.position.x;
    const directionY = touchY - (shooterBall.current.position.y + BALL_RADIUS);
    const angle = Math.atan2(directionY, directionX);
    setAimAngle(angle);
  
    const speed = 15;
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };
  
    Matter.Body.setStatic(shooterBall.current, false);
    Matter.Body.set(shooterBall.current, {
      restitution: 1,
      friction: 0,
      frictionAir: 0,
    });
    Matter.Body.setVelocity(shooterBall.current, velocity);
  
    setIsBallAtCenter(false);
  }, [canShoot, gameOver]);
  


  
  const storeShooterResults = async () => {
    try {
      await addDoc(collection(db, "ShooterResults"), {
        Nickname: nickname,
        score: scoreRef.current,
      });
    } catch (error) {
      console.error("Error storing result: ", error);
    }
    navigation.replace("ShooterGameOver", {
      nickname,
      finalScore: scoreRef.current,
    });
  };

  useEffect(() => {
    const { engine, world, ceiling } = createPhysics(width, height);
    engineRef.current = engine;
    worldRef.current = world;
    ceilingRef.current = ceiling;

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
          if (isStaticBall || bodyB === ceiling || bodyA === ceiling) {
            Matter.Body.setVelocity(shooter, { x: 0, y: 0 });
            Matter.Body.setStatic(shooter, true);

            const snappedCoords = snapToGrid(shooter, width, numCols);
            Matter.Body.setPosition(shooter, snappedCoords);
            const row = getGridRow(snappedCoords.y);
            let baseOffset = (width - (numCols * BALL_RADIUS * 2)) / 2;
            if (row % 2 !== 0) baseOffset += BALL_RADIUS;
            const col = Math.round((snappedCoords.x - baseOffset) / (BALL_RADIUS * 2));
            shooter.gridRow = row;
            shooter.gridCol = col;

            const cluster = findClusterAndRemove(staticBallsRef.current, shooter);
            if (cluster.length > 0) {
              const totalPoints = cluster.length * 10;
              const avgX = cluster.reduce((sum, b) => sum + b.position.x, 0) / cluster.length;
              const avgY = cluster.reduce((sum, b) => sum + b.position.y, 0) / cluster.length;
              addAggregatedPopup(totalPoints, avgX, avgY);
              cluster.forEach(ball => {
                playPopSound();
                setPoppedBalls(prev => [...prev, { id: ball.id, x: ball.position.x, y: ball.position.y, color: ball.color }]);
                Matter.World.remove(world, ball);
              });
              setStaticBalls(prev => prev.filter(ball => !cluster.includes(ball)));
              setScore(prev => {
                const newScore = prev + totalPoints;
                scoreRef.current = newScore;
                return newScore;
              });
            } else {
              shotCounterRef.current += 1;
              setStaticBalls(prev => [...prev, shooter]);
              if (shotCounterRef.current >= 5) {
                shotCounterRef.current = 0;
                const availableColors = getAvailableColors(staticBallsRef.current);
                const rowsToAdd = availableColors.length === 2 ? 4 : 1;
                addRows(rowsToAdd);
              }
            }

            const updatedBalls = staticBallsRef.current.filter(ball => !cluster.includes(ball));
            const floatingBalls = findFloatingBalls(updatedBalls);
            if (floatingBalls.length > 0) {
              floatingBalls.forEach(ball => {
                playPopSound();
                addAggregatedPopup(15, ball.position.x, ball.position.y);
                setPoppedBalls(prev => [...prev, { id: ball.id, x: ball.position.x, y: ball.position.y, color: ball.color }]);
                Matter.World.remove(world, ball);
              });
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
      }
    };

    Matter.Events.on(engine, 'collisionStart', collisionHandler);

    const update = () => {
      updatePhysics(engine);
      if (shooterBall.current) {
        const { x, y } = shooterBall.current.position;
        setBallPosition({ x, y });
      }

      if (!gameOverTriggered.current) {
        for (let ball of staticBallsRef.current) {
          if (ball.position.y + BALL_RADIUS >= height - 220) {
            gameOverTriggered.current = true;
            setGameOver(true);
            storeShooterResults();
            break;
          }
        }
      }

      rafIdRef.current = requestAnimationFrame(update);
    };

    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    update();

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      Matter.Events.off(engine, 'collisionStart', collisionHandler);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
      shooterBall.current = null;
      staticBallsRef.current = [];
      rafIdRef.current = null;
      gameOverTriggered.current = false;
    };
  }, []);

  useEffect(() => {
    if (ballsInitialized && staticBalls.length === 0 && !gameOverTriggered.current) {
      gameOverTriggered.current = true;
      setGameOver(true);
      storeShooterResults();
    }
  }, [staticBalls, ballsInitialized]);

  return (
    <View
      style={{ flex: 1, position: 'relative' }}
      onStartShouldSetResponder={() => canShoot}
      onResponderGrant={(e) => {
        const { pageX, pageY } = e.nativeEvent;
        setTouchStart({ x: pageX, y: pageY });
        setTouchCurrent({ x: pageX, y: pageY });
      }}
      onResponderMove={(e) => {
        const { pageX, pageY } = e.nativeEvent;
        setTouchCurrent({ x: pageX, y: pageY });
      }}
      onResponderRelease={(e) => {
        const { pageX, pageY } = e.nativeEvent;
        handleTouch({ nativeEvent: { pageX, pageY } });
        setTouchStart(null);
        setTouchCurrent(null);
      }}
    >
      <LinearGradient colors={['rgb(255, 158, 226)', '#fac3e9']} style={shooterStyles.shooterGameContainer}>
  
        {/* Yläpalkki */}
        <View style={shooterStyles.homeBox}>
          <TouchableOpacity onPress={() => navigation.replace('Home')}>
            <Ionicons name="home" style={shooterStyles.shooterHomeIcon} />
          </TouchableOpacity>
        </View>
  
        <View style={shooterStyles.scoreBox}>
          <Text style={shooterStyles.shooterScoreText}>Score: {score}</Text>
        </View>
  
        {/* Nuoli piirretään ensin → jää pallon alle */}
        {shooterBall.current && (
          <ShooterArrow
            shooterPosition={shooterBall.current.position}
            touchStart={touchStart}
            touchCurrent={touchCurrent}
            staticBalls={staticBallsRef.current}
            width={width}
            numCols={numCols}
            ballRadius={BALL_RADIUS}
          />
        )}
  
        {/* Staattiset pallot */}
        {staticBalls.map(ball => (
          <Ball key={ball.id} x={ball.position.x} y={ball.position.y} size={40} color={ball.color} />
        ))}
  
        {/* Ampumispallo piirretään myöhemmin → jää nuolen päälle */}
        {shooterBall.current && (
          <Ball
            x={ballPosition.x}
            y={ballPosition.y}
            size={40}
            color={shooterBall.current?.color || 'blue'}
          />
        )}
  
        {/* Animaatiopallot (pop) */}
        {poppedBalls.map(pop => (
          <AnimatedBall
            key={pop.id}
            x={pop.x}
            y={pop.y}
            size={40}
            color={pop.color}
            onAnimationEnd={() => {
              setPoppedBalls(prev => prev.filter(item => item.id !== pop.id));
            }}
          />
        ))}
  
        {/* Yhteenvetopisteet */}
        {aggregatedPopup && (
          <ScorePopUp
            key={aggregatedPopup.id}
            score={aggregatedPopup.points}
            x={aggregatedPopup.x}
            y={aggregatedPopup.y}
            onAnimationEnd={() => setAggregatedPopup(null)}
          />
        )}
  
        {/* Taustakuva */}
        <Image
          source={require('../assets/image.png')}
          style={{ position: 'absolute', bottom: -90, right: -100, width: 300, height: 300 }}
          resizeMode="contain"
        />
      </LinearGradient>
    </View>
  );  
  
};

export default BubbleShooter;
