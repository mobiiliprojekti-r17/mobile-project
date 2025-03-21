import React, { useEffect, useState, useRef } from 'react';
import { View, TouchableWithoutFeedback, Dimensions, StyleSheet } from 'react-native';
import Matter from 'matter-js';
import { createPhysics, createShooterBall, createStaticBalls, updatePhysics } from '../utils/shooterPhysics';
import Ball from './ShooterBall';

const { width, height } = Dimensions.get('window');

const BubbleShooter = () => {
  const { engine, world } = createPhysics();
  const shooterBall = useRef(null);
  const [ballPosition, setBallPosition] = useState({ x: width / 2, y: height - 200 });
  const [staticBalls, setStaticBalls] = useState([]);
  const [isBallAtCenter, setIsBallAtCenter] = useState(true);

  useEffect(() => {
    shooterBall.current = createShooterBall(world, width / 2, height - 200, 25);
    //luodaan peliruutu
    const wallOptions = { isStatic: true, restitution: 1 };
    const ground = Matter.Bodies.rectangle(width / 2, height - 80, width, 50, { isStatic: true });
    const leftWall = Matter.Bodies.rectangle(0, height / 2, 50, height, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width, height / 2, 50, height, wallOptions);
    const ceiling = Matter.Bodies.rectangle(width / 2, 0, width, 50, wallOptions);

    Matter.World.add(world, [ground, leftWall, rightWall, ceiling]);

    // Luo staattiset pallot
    const staticBallsArray = createStaticBalls(world, 3, 7, width);
    setStaticBalls(staticBallsArray);

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

        //Jos shooterBall osuu lattiaan, sallitaan uusi laukaus
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
    if (!isBallAtCenter && shooterBall.current) {
      // Asetetaan pallon isStatic false, kun pallo ei ole keskellä
      Matter.Body.setStatic(shooterBall.current, false);
    }
  }, [isBallAtCenter]);

  
//---------------------------------------------------------------------------------------------------------
const resetShooterBall = () => {
    // Varmistetaan, että pallo ei liiku ennen uutta laukausta
    Matter.Body.setPosition(shooterBall.current, { x: width / 2, y: height - 224 });
    Matter.Body.setVelocity(shooterBall.current, { x: 0, y: 0 });
    Matter.Body.set(shooterBall.current, {
        restitution: 0, 
        frictionAir: 0, 
        isStatic: true,

      });
    // Kun pallo on palautettu alkuperäiseen paikkaansa, sallitaan uusi ammunta
    setIsBallAtCenter(true) ; 
    
  };
//----------------------------------------------------------------------------------------------------------

const handleTouch = (event) => {
    if (!isBallAtCenter) return;
  
    const touchX = event.nativeEvent.pageX;
    const touchY = event.nativeEvent.pageY;
  
    // Laske suunta (kosketuspaikka ja pallo)
    const directionX = touchX - shooterBall.current.position.x;
    const directionY = touchY - shooterBall.current.position.y;
  
    // Laske suuntavektorin pituus
    const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);
  
    // Aseta vakio nopeus, joka on aina sama riippumatta kosketuspaikasta
    const speed = 20; //pallon nopeus
    const normalizedX = (directionX / magnitude) * speed; 
    const normalizedY = (directionY / magnitude) * speed;
  
    // Aseta pallon nopeus vakiona, riippumatta kosketuksesta
    Matter.Body.setVelocity(shooterBall.current, { x: normalizedX, y: normalizedY });
  
    setIsBallAtCenter(false); // Estää ammunnan ennen kuin pallo on palannut
  };
  return (
    <TouchableWithoutFeedback onPress={handleTouch}>
      <View style={styles.container}>
        {staticBalls.map((ball, index) => (
          <Ball key={index} x={ball.position.x} y={ball.position.y} size={40} color="red" />
        ))}
        <Ball x={ballPosition.x} y={ballPosition.y} size={50} color="blue" />
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
