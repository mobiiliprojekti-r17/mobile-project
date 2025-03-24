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
    
        // Tarkista osuuko johonkin static palloon
        const isStaticBall = staticBallsArray.some((b) => b.id === otherBall.id);
    
        if (isStaticBall) {
          if (shooter.color === otherBall.color) {
            // SAMA VÄRI: poistetaan staattinen pallo
            Matter.World.remove(world, otherBall);
            setStaticBalls((prev) => prev.filter((b) => b.id !== otherBall.id));
            shooterBall.current = null;
            resetShooterBall();
          } else {
            // ERI VÄRI: ammuttu pallo jää kentälle uutena staattisena pallona
            Matter.Body.setVelocity(shooter, { x: 0, y: 0 });
            Matter.Body.setPosition(shooter, { x: shooter.position.x, y: shooter.position.y });
            Matter.Body.setStatic(shooter, true);
            staticBallsArray.push(shooter);
            setStaticBalls([...staticBallsArray]);
            shooterBall.current = null;
            resetShooterBall();
          }
        }
    
        // Törmäys kattoon
        if ((bodyA === shooter && bodyB === ceiling) || (bodyB === shooter && bodyA === ceiling)) {
          shooterBall.current = null;
          resetShooterBall();
        }
      });
    });
    
    

    const update = () => {
      updatePhysics(engine);
      const { x, y } = shooterBall.current.position;
      setBallPosition({ x, y });
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
    initShooterBall();
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
        {staticBalls.map((ball, index) => (
          <Ball key={index} x={ball.position.x} y={ball.position.y} size={40} color={ball.color} />
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
});

export default BubbleShooter;