import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableWithoutFeedback, Dimensions, StyleSheet } from 'react-native';
import Matter from 'matter-js';
import { createPhysics, createShooterBall, createStaticBalls, updatePhysics, getRandomPastelColor } from '../utils/shooterPhysics';
import Ball from './ShooterBall';

const { width, height } = Dimensions.get('window');

const BubbleShooter = ({ navigation }) => {
  const { engine, world, ceiling } = createPhysics(width, height);
  const shooterBall = useRef(null);
  const [ballPosition, setBallPosition] = useState({ x: width / 2, y: height - 200 });
  const [staticBalls, setStaticBalls] = useState([]);
  const [ballsInitialized, setBallsInitialized] = useState(false);
  const [isBallAtCenter, setIsBallAtCenter] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initShooterBall();

    const staticBallsArray = createStaticBalls(world, 3, 7, width);
    setStaticBalls(staticBallsArray);
    setBallsInitialized(true);

    Matter.Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;

      pairs.forEach(({ bodyA, bodyB }) => {
        const shooter = shooterBall.current;
        if (!shooter) return;

        const isShooterA = bodyA === shooter;
        const otherBall = isShooterA ? bodyB : bodyA;

        if (otherBall && otherBall !== shooter) {
          const isSameColor = shooter.color === otherBall.color;

          if (isSameColor) {
            // Poistetaan pallot, jos ne ovat samanvärisiä
            Matter.World.remove(world, otherBall);
            setStaticBalls((prev) => prev.filter((b) => b.id !== otherBall.id));

            Matter.World.remove(world, shooter);
            shooterBall.current = null;
            resetShooterBall();
          } else {
            // Kiinnitetään pallo ruudukkoon
            const snapPosition = getNearestGridPosition(shooter.position.x, shooter.position.y);
            Matter.Body.setPosition(shooter, snapPosition);
            Matter.Body.setVelocity(shooter, { x: 0, y: 0 });
            Matter.Body.setStatic(shooter, true);

            setStaticBalls((prev) => [...prev, { ...shooter, id: `ball-${Date.now()}` }]);

            shooterBall.current = null;
            resetShooterBall();
          }
        }

        if ((bodyA === shooter && bodyB === ceiling) || (bodyB === shooter && bodyA === ceiling)) {
          shooterBall.current = null;
          resetShooterBall();
        }
      });
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
    shooterBall.current = createShooterBall(world, width / 2, height - 200, 25, getRandomPastelColor());
    Matter.Body.setStatic(shooterBall.current, true);
  };

  const resetShooterBall = () => {
    const newBall = createShooterBall(world, width / 2, height - 200, 25, getRandomPastelColor());
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
