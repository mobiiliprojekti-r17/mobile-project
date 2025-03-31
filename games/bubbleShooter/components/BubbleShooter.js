
import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableWithoutFeedback, Dimensions, StyleSheet } from 'react-native';
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

  useEffect(() => {
    staticBallsRef.current = staticBalls;
  }, [staticBalls]);

  useEffect(() => {
    initShooterBall();
    const initialStaticBalls = createStaticBalls(world, 3, 7, width);
    setStaticBalls(initialStaticBalls);
    setBallsInitialized(true);

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
              Matter.Body.setPosition(shooter, { x: newX, y: newY });
            }

            if (shooter.color === other.color) {
              Matter.World.remove(world, other);
              setStaticBalls((prev) => prev.filter((b) => b.id !== other.id));
              Matter.World.remove(world, shooter);
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
    const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
    const speed = 20;
    const normalizedX = (directionX / magnitude) * speed;
    const normalizedY = (directionY / magnitude) * speed;

    Matter.Body.setStatic(shooterBall.current, false);
    Matter.Body.setVelocity(shooterBall.current, { x: normalizedX, y: normalizedY });

    setIsBallAtCenter(false);
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View style={styles.container}>
        {staticBalls.map((ball) => (
          <Ball key={ball.id} x={ball.position.x} y={ball.position.y} size={40} color={ball.color} />
        ))}
        <Ball x={ballPosition.x} y={ballPosition.y} size={40} color={shooterBall.current?.color || 'blue'} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const getNearestGridPosition = (x, y) => {
  const gridSize = 40;
  const snapX = Math.round(x / gridSize) * gridSize;
  const snapY = Math.round(y / gridSize) * gridSize;
  return { x: snapX, y: snapY };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'skyblue',
  },
});

export default BubbleShooter;