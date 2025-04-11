import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const PIPE_WIDTH = 60;
const PIPE_GAP = 250;
const GROUND_HEIGHT = 50;

// Renderöivä komponentti lintua varten
const Bird = (props) => {
  const { body, size, color } = props;
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;
  return (
    <View
      style={[
        styles.bird,
        {
          left: x,
          top: y,
          width: size[0],
          height: size[1],
          backgroundColor: color || 'yellow',
        },
      ]}
    />
  );
};

// Renderöivä komponentti maan (ground) näyttämiseksi
const Ground = (props) => {
  const { body, size } = props;
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;
  return <View style={[styles.ground, { left: x, top: y, width: size[0], height: size[1] }]} />;
};

// Renderöivä komponentti putkille
const Pipe = (props) => {
  const { body, size } = props;
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;
  return <View style={[styles.pipe, { left: x, top: y, width: size[0], height: size[1] }]} />;
};

// Päivitetään fysiikkamoottoria sekä siirretään putket
const Physics = (entities, { time, dispatch }) => {
    const engine = entities.physics.engine;
    Matter.Engine.update(engine, time.delta);
  
    // Siirretään putket vasemmalle
    const pipeVelocity = 2;
    if (entities.topPipe && entities.bottomPipe) {
      const topPipe = entities.topPipe.body;
      const bottomPipe = entities.bottomPipe.body;
      Matter.Body.translate(topPipe, { x: -pipeVelocity, y: 0 });
      Matter.Body.translate(bottomPipe, { x: -pipeVelocity, y: 0 });
  
      // Kun putket menevät näytöltä, palautetaan ne oikealta uusilla satunnaisilla korkeuksilla
      if (topPipe.position.x < -PIPE_WIDTH / 2) {
        const minPipeHeight = 50;
        const maxPipeHeight = SCREEN_HEIGHT - PIPE_GAP - GROUND_HEIGHT - 50;
        const newTopPipeHeight = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight;
  
        // Päivitetään topPipe
        Matter.Body.setPosition(topPipe, { x: SCREEN_WIDTH + PIPE_WIDTH / 2, y: newTopPipeHeight / 2 });
        entities.topPipe.size[1] = newTopPipeHeight;
  
        // Lasketaan ja päivitetään bottomPipe
        const newBottomPipeHeight = SCREEN_HEIGHT - newTopPipeHeight - PIPE_GAP - GROUND_HEIGHT;
        Matter.Body.setPosition(bottomPipe, { x: SCREEN_WIDTH + PIPE_WIDTH / 2, y: newTopPipeHeight + PIPE_GAP + newBottomPipeHeight / 2 });
        entities.bottomPipe.size[1] = newBottomPipeHeight;
      }
    }
  
    // Törmäystarkistus vain, jos kaikki entiteetit ovat kunnossa
    if (entities.bird && entities.ground && entities.topPipe && entities.bottomPipe &&
        entities.bird.body && entities.ground.body && entities.topPipe.body && entities.bottomPipe.body) {
      const bird = entities.bird.body;
      const ground = entities.ground.body;
      const topPipe = entities.topPipe.body;
      const bottomPipe = entities.bottomPipe.body;
  
      const collisionWithGround = Matter.SAT.collides(bird, ground);
      const collisionWithTopPipe = Matter.SAT.collides(bird, topPipe);
      const collisionWithBottomPipe = Matter.SAT.collides(bird, bottomPipe);
  
      // Määritetään overlap-toleranssi (esim. 2)
      const minOverlap = 2;
      if (
        (collisionWithGround && collisionWithGround.collided && collisionWithGround.overlap > minOverlap) ||
        (collisionWithTopPipe && collisionWithTopPipe.collided && collisionWithTopPipe.overlap > minOverlap) ||
        (collisionWithBottomPipe && collisionWithBottomPipe.collided && collisionWithBottomPipe.overlap > minOverlap)
      ) {
        dispatch({ type: 'game-over' });
      }
    }
  
    return entities;
  };
  

// Luo fysiikkamaailman: lintu, maa ja ensimmäinen putkisarja
const setupWorld = () => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  world.gravity.y = 1;

  // Lintu
  const bird = Matter.Bodies.rectangle(50, SCREEN_HEIGHT / 2, 40, 30);
  // Maa (ground)
  const ground = Matter.Bodies.rectangle(SCREEN_WIDTH / 2, SCREEN_HEIGHT - GROUND_HEIGHT / 2, SCREEN_WIDTH, GROUND_HEIGHT, { isStatic: true });
  
  // Putkien asetukset: satunnainen yläputken korkeus
  const minPipeHeight = 50;
  const maxPipeHeight = SCREEN_HEIGHT - PIPE_GAP - GROUND_HEIGHT - 50;
  const topPipeHeight = Math.random() * (maxPipeHeight - minPipeHeight) + minPipeHeight;
  const topPipe = Matter.Bodies.rectangle(SCREEN_WIDTH + PIPE_WIDTH / 2, topPipeHeight / 2, PIPE_WIDTH, topPipeHeight, { isStatic: true });
  const bottomPipeHeight = SCREEN_HEIGHT - topPipeHeight - PIPE_GAP - GROUND_HEIGHT;
  const bottomPipe = Matter.Bodies.rectangle(SCREEN_WIDTH + PIPE_WIDTH / 2, topPipeHeight + PIPE_GAP + bottomPipeHeight / 2, PIPE_WIDTH, bottomPipeHeight, { isStatic: true });

  Matter.World.add(world, [bird, ground, topPipe, bottomPipe]);

  return {
    physics: { engine, world },
    bird: { body: bird, size: [40, 30], color: 'yellow', renderer: Bird },
    ground: { body: ground, size: [SCREEN_WIDTH, GROUND_HEIGHT], renderer: Ground },
    topPipe: { body: topPipe, size: [PIPE_WIDTH, topPipeHeight], renderer: Pipe },
    bottomPipe: { body: bottomPipe, size: [PIPE_WIDTH, bottomPipeHeight], renderer: Pipe },
  };
};

const MatterGameEngine = ({ running, onGameOver, resetGame }) => {
  const gameEngine = useRef(null);
  const [entities, setEntities] = useState(setupWorld());

 
  // Lisää tämä alussa yhdessä muiden hookien kanssa
const lastJumpTime = useRef(0);

const onTouch = () => {
  const now = Date.now();
  // Estetään hyppy, jos edellinen hyppy tapahtui alle 150ms sitten
  if (now - lastJumpTime.current < 150) {
    return;
  }
  lastJumpTime.current = now;

  const birdBody = entities.bird.body;
  // Voit halutessasi tarkistaa lintusi nykyisen pystysuoran nopeuden
  if (birdBody.velocity.y < -5) {
    // Jos lintu jo nousee nopeasti, ei tehdä lisähyppyä
    return;
  }
  
  Matter.Body.applyForce(
    birdBody,
    { x: birdBody.position.x, y: birdBody.position.y },
    { x: 0, y: -0.05 }
  );
};


  return (
    <TouchableWithoutFeedback onPress={onTouch}>
      <View style={styles.container}>
        <GameEngine
          ref={gameEngine}
          style={styles.container}
          systems={[Physics]}
          entities={entities}
          running={running}
          onEvent={(e) => {
            if (e.type === 'game-over') {
              onGameOver();
            }
          }}
        />
        {!running && (
          <View style={styles.overlay}>
            <Text style={styles.gameOverText}>Game Over</Text>
            <TouchableOpacity 
  style={styles.restartButton} 
  onPress={() => {
    const newEntities = setupWorld();
    setEntities(newEntities);
    if (gameEngine.current) {
      gameEngine.current.swap(newEntities);
    }
    resetGame();
  }}>
  <Text style={styles.restartText}>Restart</Text>
</TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#70c5ce',
  },
  bird: {
    position: 'absolute',
    borderRadius: 10,
  },
  ground: {
    position: 'absolute',
    backgroundColor: 'brown',
  },
  pipe: {
    position: 'absolute',
    backgroundColor: 'green',
  },
  overlay: {
    position: 'absolute',
    top: SCREEN_HEIGHT / 2 - 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  gameOverText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  restartButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  restartText: {
    color: 'white',
    fontSize: 20,
  },
});

export default MatterGameEngine;