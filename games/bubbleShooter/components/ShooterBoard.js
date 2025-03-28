
import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableWithoutFeedback, Dimensions, StyleSheet } from 'react-native';
import Matter from 'matter-js';
import { createPhysics, createShooterBall, createStaticBalls, updatePhysics, getRandomPastelColor } from '../utils/shooterPhysics';
import Ball from './ShooterBall';

const { width, height } = Dimensions.get('window');

const BubbleShooter = ({ navigation }) => {
  const { engine, world } = createPhysics();
  const shooterBall = useRef(null);
  const [ballPosition, setBallPosition] = useState({ x: width / 2, y: height - 200 });
  const [staticBalls, setStaticBalls] = useState([]);
  const [ballsInitialized, setBallsInitialized] = useState(false);
  const [isBallAtCenter, setIsBallAtCenter] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    shooterBall.current = createShooterBall(world, width / 2, height - 200, 25);
    shooterBall.current.color = getRandomPastelColor(); 

    const wallOptions = { isStatic: true, restitution: 1 };
    const ground = Matter.Bodies.rectangle(width / 2, height - 80, width, 50, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(0, height / 2, 50, height, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width, height / 2, 50, height, wallOptions);
    const ceiling = Matter.Bodies.rectangle(width / 2, 0, width, 50, wallOptions);

    Matter.World.add(world, [ground, leftWall, rightWall, ceiling]);

    const staticBallsArray = createStaticBalls(world, 3, 7, width);
    staticBallsArray.forEach(ball => {
      ball.color = getRandomPastelColor();
    });
    setStaticBalls(staticBallsArray);
    setBallsInitialized(true);

    Matter.Events.on(engine, 'collisionStart', (event) => {
      const pairs = event.pairs;

      pairs.forEach(({ bodyA, bodyB }) => {
        if ((bodyA === shooterBall.current && staticBallsArray.includes(bodyB)) ||
            (bodyB === shooterBall.current && staticBallsArray.includes(bodyA))) {
          const ballToRemove = staticBallsArray.includes(bodyA) ? bodyA : bodyB;
          Matter.World.remove(world, ballToRemove);
          setStaticBalls((prev) => prev.filter((b) => b !== ballToRemove));
          resetShooterBall();
        }

        if (bodyA === shooterBall.current && bodyB === ceiling || 
            bodyB === shooterBall.current && bodyA === ceiling) {
          resetShooterBall();
        } 
      });
    });

    const update = () => {
      updatePhysics(engine, shooterBall.current, staticBalls, resetShooterBall);
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

  useEffect(() => {
    if (!isBallAtCenter && shooterBall.current) {
      Matter.Body.setStatic(shooterBall.current, false);
    }
  }, [isBallAtCenter]);

  const resetShooterBall = () => {
    Matter.Body.setPosition(shooterBall.current, { x: width / 2, y: height - 224 });
    Matter.Body.setVelocity(shooterBall.current, { x: 0, y: 0 });
    Matter.Body.set(shooterBall.current, {
      restitution: 0, 
      frictionAir: 0, 
      isStatic: true,
    });
    shooterBall.current.color = getRandomPastelColor(); 
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
    Matter.Body.setVelocity(shooterBall.current, { x: normalizedX, y: normalizedY });
    setIsBallAtCenter(false); 
  };

  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View style={styles.container}>
        {staticBalls.map((ball, index) => (
          <Ball key={index} x={ball.position.x} y={ball.position.y} size={40} color={ball.color} />
        ))}
        <Ball x={ballPosition.x} y={ballPosition.y} size={50} color={shooterBall.current?.color || 'blue'} />
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


