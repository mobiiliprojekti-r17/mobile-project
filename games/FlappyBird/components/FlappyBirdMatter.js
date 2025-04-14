import React, { useRef, useState } from 'react';
import { View, StyleSheet, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Configuration Constants
const PIPE_WIDTH = 60;
const PIPE_GAP = 250;
const GROUND_HEIGHT = 50;
const ROOF_HEIGHT = 50;
const GRAVITY = 0.7;
const JUMP_VELOCITY = -8; // Consistent jump velocity
const PIPE_VELOCITY = 1.5;

// Bird component for the Matter engine
const Bird = ({ body, size, color }) => {
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;
  return (
    <View
      style={[
        styles.bird,
        { left: x, top: y, width: size[0], height: size[1], backgroundColor: color || 'yellow' },
      ]}
    />
  );
};

const Ground = ({ body, size }) => {
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;
  return <View style={[styles.ground, { left: x, top: y, width: size[0], height: size[1] }]} />;
};

const Pipe = ({ body, size }) => {
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;
  return <View style={[styles.pipe, { left: x, top: y, width: size[0], height: size[1] }]} />;
};

// Physics system: update physics, move pipes, handle collisions & scoring.
const Physics = (entities, { dispatch }) => {
  const engine = entities.physics.engine;
  Matter.Engine.update(engine, 16);

  // Move pipes horizontally and recycle them when off screen.
  if (entities.topPipe && entities.bottomPipe) {
    const topPipe = entities.topPipe.body;
    const bottomPipe = entities.bottomPipe.body;
    Matter.Body.translate(topPipe, { x: -PIPE_VELOCITY, y: 0 });
    Matter.Body.translate(bottomPipe, { x: -PIPE_VELOCITY, y: 0 });

    // Recycle pipes when the top pipe is off screen.
    if (topPipe.position.x < -PIPE_WIDTH / 2) {
      const MIN_PIPE_HEIGHT = 50;
      const maxPipeHeight = SCREEN_HEIGHT - PIPE_GAP - GROUND_HEIGHT - MIN_PIPE_HEIGHT;
      const newTopPipeHeight = Math.random() * (maxPipeHeight - MIN_PIPE_HEIGHT) + MIN_PIPE_HEIGHT;
      Matter.Body.setPosition(topPipe, {
        x: SCREEN_WIDTH + PIPE_WIDTH / 2,
        y: newTopPipeHeight / 2,
      });
      entities.topPipe.size[1] = newTopPipeHeight;
      entities.topPipe.scored = false; // reset flag for new pipe set

      const newBottomPipeHeight = SCREEN_HEIGHT - newTopPipeHeight - PIPE_GAP - GROUND_HEIGHT;
      Matter.Body.setPosition(bottomPipe, {
        x: SCREEN_WIDTH + PIPE_WIDTH / 2,
        y: newTopPipeHeight + PIPE_GAP + newBottomPipeHeight / 2,
      });
      entities.bottomPipe.size[1] = newBottomPipeHeight;
    }
  }

  // Check collisions with ground and roof using Matter's collision test.
  if (
    entities.bird &&
    entities.ground &&
    entities.roof &&
    entities.bird.body &&
    entities.ground.body &&
    entities.roof.body
  ) {
    const birdBody = entities.bird.body;
    const collisionWithGround = Matter.Collision.collides(birdBody, entities.ground.body) || {};
    const collisionWithRoof = Matter.Collision.collides(birdBody, entities.roof.body) || {};
    if (collisionWithGround.collided || collisionWithRoof.collided) {
      dispatch({ type: 'game-over' });
    }
  }

  // Manual pipe collision and scoring using full bird boundaries.
  if (
    entities.bird &&
    entities.topPipe &&
    entities.bottomPipe &&
    entities.bird.body &&
    entities.topPipe.body &&
    entities.bottomPipe.body
  ) {
    const birdBody = entities.bird.body;
    const topPipeBody = entities.topPipe.body;

    // Calculate bird boundaries.
    const birdHalfWidth = entities.bird.size[0] / 2;
    const birdHalfHeight = entities.bird.size[1] / 2;
    const birdLeft = birdBody.position.x - birdHalfWidth;
    const birdRight = birdBody.position.x + birdHalfWidth;
    const birdTop = birdBody.position.y - birdHalfHeight;
    const birdBottom = birdBody.position.y + birdHalfHeight;

    // Calculate pipe horizontal boundaries.
    const pipeCenterX = topPipeBody.position.x;
    const pipeLeft = pipeCenterX - PIPE_WIDTH / 2;
    const pipeRight = pipeCenterX + PIPE_WIDTH / 2;

    // Safe gap boundaries.
    const gapTop = entities.topPipe.size[1]; // bottom edge of the top pipe
    const gapBottom = gapTop + PIPE_GAP;       // top edge of the bottom pipe

    // Collision Check:
    // Check if there is any horizontal overlap between the bird and the pipe.
    if (birdLeft < pipeRight && birdRight > pipeLeft) {
      // If any portion of the bird is outside the safe gap, trigger game over.
      if (birdTop < gapTop || birdBottom > gapBottom) {
        dispatch({ type: 'game-over' });
      }
    }

    // Scoring Check:
    // Award score if the pipe is completely past the bird and the bird is safe.
    if (pipeRight < birdLeft && !entities.topPipe.scored) {
      if (birdTop >= gapTop && birdBottom <= gapBottom) {
        entities.topPipe.scored = true;
        dispatch({ type: 'score' });
      }
    }
  }

  return entities;
};

// Set up the Matter.js world and initialize game entities.
const setupWorld = () => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  world.gravity.y = GRAVITY;

  const bird = Matter.Bodies.rectangle(50, SCREEN_HEIGHT / 2, 40, 30);
  const ground = Matter.Bodies.rectangle(
    SCREEN_WIDTH / 2,
    SCREEN_HEIGHT - GROUND_HEIGHT / 2,
    SCREEN_WIDTH,
    GROUND_HEIGHT,
    { isStatic: true }
  );
  const roof = Matter.Bodies.rectangle(
    SCREEN_WIDTH / 2,
    ROOF_HEIGHT / 2,
    SCREEN_WIDTH,
    ROOF_HEIGHT,
    { isStatic: true }
  );

  const MIN_PIPE_HEIGHT = 50;
  const maxPipeHeight = SCREEN_HEIGHT - PIPE_GAP - GROUND_HEIGHT - MIN_PIPE_HEIGHT;
  const topPipeHeight = Math.random() * (maxPipeHeight - MIN_PIPE_HEIGHT) + MIN_PIPE_HEIGHT;
  const topPipe = Matter.Bodies.rectangle(
    SCREEN_WIDTH + PIPE_WIDTH / 2,
    topPipeHeight / 2,
    PIPE_WIDTH,
    topPipeHeight,
    { isStatic: true }
  );
  const bottomPipeHeight = SCREEN_HEIGHT - topPipeHeight - PIPE_GAP - GROUND_HEIGHT;
  const bottomPipe = Matter.Bodies.rectangle(
    SCREEN_WIDTH + PIPE_WIDTH / 2,
    topPipeHeight + PIPE_GAP + bottomPipeHeight / 2,
    PIPE_WIDTH,
    bottomPipeHeight,
    { isStatic: true }
  );

  Matter.World.add(world, [bird, ground, roof, topPipe, bottomPipe]);

  return {
    physics: { engine, world },
    bird: { body: bird, size: [40, 30], color: 'yellow', renderer: Bird },
    ground: { body: ground, size: [SCREEN_WIDTH, GROUND_HEIGHT], renderer: Ground },
    roof: { body: roof, size: [SCREEN_WIDTH, ROOF_HEIGHT], renderer: () => null },
    topPipe: { body: topPipe, size: [PIPE_WIDTH, topPipeHeight], renderer: Pipe, scored: false },
    bottomPipe: { body: bottomPipe, size: [PIPE_WIDTH, bottomPipeHeight], renderer: Pipe },
  };
};

// Main Game Engine component tying everything together.
const MatterGameEngine = ({ running, onGameOver }) => {
  const gameEngine = useRef(null);
  const [entities] = useState(setupWorld());

  // Handle jump: reset bird's vertical velocity for a consistent impulse.
  const onTouch = () => {
    const birdBody = entities.bird.body;
    Matter.Body.setVelocity(birdBody, { x: birdBody.velocity.x, y: JUMP_VELOCITY });
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
});

export default MatterGameEngine;

