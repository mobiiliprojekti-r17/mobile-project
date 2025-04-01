import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableWithoutFeedback, Dimensions, StyleSheet, Text } from 'react-native';
import Matter from 'matter-js';
import { createPhysics, createShooterBall, createStaticBalls, updatePhysics, getRandomPastelColor } from '../utils/shooterPhysics';
import Ball from './ShooterBall';

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
  const [angle, setAngle] = useState(0); 
  const [power, setPower] = useState(0); 
  const timerRef = useRef(null);

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
      for (let i = 0; i < event.pairs.length; i++) {
        if (!shooterBall.current) break;
        const { bodyA, bodyB } = event.pairs[i];
        const shooter = shooterBall.current;
        let other = null;

        if (bodyA === shooter) {
          other = bodyB;
        } else if (bodyB === shooter) {
          other = bodyA;
        }

        if (other) {
          const isStaticBall = staticBallsRef.current.some((b) => b.id === other.id);
          if (isStaticBall) {
            Matter.Body.setVelocity(shooter, { x: 0, y: 0 });
            Matter.Body.setAngularVelocity(shooter, 0);
            Matter.Body.setStatic(shooter, true);
            const dx = shooter.position.x - other.position.x;
            const dy = shooter.position.y - other.position.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist !== 0) {
              const targetDistance = BALL_RADIUS + BALL_RADIUS;
              const factor = targetDistance / dist;
              const newX = other.position.x + dx * factor;
              const newY = other.position.y + dy * factor;

              // Optional: Add logic here to move it to the nearest open spot if necessary.
              // For example, loop through the static balls and check the nearest available position.

              let adjustedX = newX;
              let adjustedY = newY;
              Matter.Body.setPosition(shooter, { x: adjustedX, y: adjustedY });
            }

            if (shooter.color === other.color) {
              Matter.World.remove(world, other);
              setStaticBalls((prev) => prev.filter((b) => b.id !== other.id));
              Matter.World.remove(world, shooter);
              setScore((prevScore) => prevScore + 10);
            } else {
              setStaticBalls((prev) => [...prev, shooter]);
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
      navigation.replace('ShooterGameOver');
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
    const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
    const speed = Math.min(magnitude / 10, 20); 

    const normalizedX = Math.cos(angle) * speed;
    const normalizedY = Math.sin(angle) * speed;

    Matter.Body.setStatic(shooterBall.current, false);
    Matter.Body.set(shooterBall.current, { restitution: 1, friction: 0, frictionAir: 0 });
    Matter.Body.setVelocity(shooterBall.current, { x: normalizedX, y: normalizedY });

    setIsBallAtCenter(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View style={styles.container}>
        <Text style={styles.score}>Pisteet: {score} | Aika: {time}s</Text>
        {staticBalls.map((ball) => (
          <Ball key={ball.id} x={ball.position.x} y={ball.position.y} size={40} color={ball.color} />
        ))}
        <Ball x={ballPosition.x} y={ballPosition.y} size={40} color={shooterBall.current?.color || 'blue'} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'skyblue',
  },
  score: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 20,
    color: 'white',
  },
});

export default BubbleShooter;
