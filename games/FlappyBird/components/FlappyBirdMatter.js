import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Configuration Constants
const PIPE_WIDTH = 60;
const PIPE_GAP = 250;
const GROUND_HEIGHT = 50;
const ROOF_HEIGHT = 50;
const GRAVITY = 0.7;
const JUMP_VELOCITY = -8; // Consistent jump velocity
const PIPE_VELOCITY = 1.5;

const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;

// =============================
// Component Definitions
// =============================

// Bird component – rendered using Matter body position
const Bird = ({ body, size, color }) => {
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
          backgroundColor: color || "yellow",
        },
      ]}
    />
  );
};

// Ground component – static object
const Ground = ({ body, size }) => {
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;
  return <View style={[styles.ground, { left: x, top: y, width: size[0], height: size[1] }]} />;
};

// Pipe component – rendered using Matter body position
const Pipe = ({ body, size }) => {
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;
  return <View style={[styles.pipe, { left: x, top: y, width: size[0], height: size[1] }]} />;
};

// =============================
// Helper to Create a Pipe Pair
// =============================
const createPipePair = () => {
  const MIN_PIPE_HEIGHT = 50;
  const maxPipeHeight =
    SCREEN_HEIGHT - PIPE_GAP - GROUND_HEIGHT - MIN_PIPE_HEIGHT;
  const topPipeHeight =
    Math.random() * (maxPipeHeight - MIN_PIPE_HEIGHT) + MIN_PIPE_HEIGHT;

  // Create top pipe Matter body (static)
  const topPipe = Matter.Bodies.rectangle(
    SCREEN_WIDTH + PIPE_WIDTH / 2,
    topPipeHeight / 2,
    PIPE_WIDTH,
    topPipeHeight,
    { isStatic: true }
  );
  // Create bottom pipe Matter body (static)
  const bottomPipeHeight =
    SCREEN_HEIGHT - topPipeHeight - PIPE_GAP - GROUND_HEIGHT;
  const bottomPipe = Matter.Bodies.rectangle(
    SCREEN_WIDTH + PIPE_WIDTH / 2,
    topPipeHeight + PIPE_GAP + bottomPipeHeight / 2,
    PIPE_WIDTH,
    bottomPipeHeight,
    { isStatic: true }
  );

  return {
    topPipe: {
      body: topPipe,
      size: [PIPE_WIDTH, topPipeHeight],
      scored: false,
      renderer: Pipe,
    },
    bottomPipe: {
      body: bottomPipe,
      size: [PIPE_WIDTH, bottomPipeHeight],
      renderer: Pipe,
    },
  };
};

// =============================
// Physics System – runs every tick
// =============================
const Physics = (entities, { dispatch }) => {
  // Use engine from entities.physics
  const engine = entities.physics.engine;
  Matter.Engine.update(engine, 16);

  // Process each pipe pair (if pipes exist)
  if (entities.pipes && Array.isArray(entities.pipes)) {
    entities.pipes.forEach((pipePair) => {
      const topPipeBody = pipePair.topPipe.body;
      const bottomPipeBody = pipePair.bottomPipe.body;

      // Calculate new X positions manually and set them, so even static bodies update.
      const newTopX = topPipeBody.position.x - PIPE_VELOCITY;
      const newBottomX = bottomPipeBody.position.x - PIPE_VELOCITY;
      Matter.Body.setPosition(topPipeBody, { x: newTopX, y: topPipeBody.position.y });
      Matter.Body.setPosition(bottomPipeBody, { x: newBottomX, y: bottomPipeBody.position.y });

      // Recycle pipe pair if top pipe is off screen.
      if (newTopX < -PIPE_WIDTH / 2) {
        const newPair = createPipePair();
        Matter.Body.setPosition(topPipeBody, newPair.topPipe.body.position);
        Matter.Body.setPosition(bottomPipeBody, newPair.bottomPipe.body.position);
        pipePair.topPipe.size = newPair.topPipe.size;
        pipePair.bottomPipe.size = newPair.bottomPipe.size;
        pipePair.topPipe.scored = false;
      }

      // ------------------------------
      // Collision & Scoring Checks
      // ------------------------------
      const birdBody = entities.bird.body;
      const birdHalfWidth = BIRD_WIDTH / 2;
      const birdHalfHeight = BIRD_HEIGHT / 2;
      const birdLeft = birdBody.position.x - birdHalfWidth;
      const birdRight = birdBody.position.x + birdHalfWidth;
      const birdTop = birdBody.position.y - birdHalfHeight;
      const birdBottom = birdBody.position.y + birdHalfHeight;

      // Use top pipe from the pair for horizontal boundaries (both share same x)
      const pipeCenterX = topPipeBody.position.x;
      const pipeLeft = pipeCenterX - PIPE_WIDTH / 2;
      const pipeRight = pipeCenterX + PIPE_WIDTH / 2;

      // Define safe gap boundaries.
      const gapTop = pipePair.topPipe.size[1];          // bottom edge of top pipe
      const gapBottom = gapTop + PIPE_GAP;                // top edge of bottom pipe

      // Collision Check:
      // If there is horizontal overlap and the bird isn’t completely in the safe gap…
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < gapTop || birdBottom > gapBottom) {
          dispatch({ type: "game-over" });
        }
      }
      // Scoring Check:
      // When the pipe pair has fully passed the bird and the bird is safely in the gap, award a score.
      if (pipeRight < birdLeft && !pipePair.topPipe.scored) {
        if (birdTop >= gapTop && birdBottom <= gapBottom) {
          pipePair.topPipe.scored = true;
          dispatch({ type: "score" });
        }
      }
    });
  }

  // Check collisions with ground and roof (using Matter's collision detection)
  if (entities.bird && entities.ground && entities.roof) {
    const birdBody = entities.bird.body;
    const collisionWithGround =
      Matter.Collision.collides(birdBody, entities.ground.body) || {};
    const collisionWithRoof =
      Matter.Collision.collides(birdBody, entities.roof.body) || {};
    if (collisionWithGround.collided || collisionWithRoof.collided) {
      dispatch({ type: "game-over" });
    }
  }
  
  return entities;
};

// =============================
// setupWorld (Flat Structure – similar to BrickBreaker)
// =============================
const setupWorld = () => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  world.gravity.y = GRAVITY;

  const bird = Matter.Bodies.rectangle(50, SCREEN_HEIGHT / 2, BIRD_WIDTH, BIRD_HEIGHT);
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

  const pipes = [createPipePair(), createPipePair()];
  // Offset second pair so they don't appear simultaneously
  Matter.Body.translate(pipes[1].topPipe.body, { x: SCREEN_WIDTH * 0.7, y: 0 });
  Matter.Body.translate(pipes[1].bottomPipe.body, { x: SCREEN_WIDTH * 0.7, y: 0 });

  Matter.World.add(world, [bird, ground, roof]);
  pipes.forEach((pair) => {
    Matter.World.add(world, [pair.topPipe.body, pair.bottomPipe.body]);
  });

  return {
    engine,
    world,
    bird,
    ground,
    roof,
    pipes,
  };
};

// =============================
// Main Game Engine Component
// =============================
const MatterGameEngine = ({ running, onGameOver }) => {
  const gameEngine = useRef(null);
  const [entitiesState] = useState(setupWorld());

  // On touch, update the bird’s vertical velocity (simulate jump)
  const onTouch = () => {
    const birdBody = entitiesState.bird;
    Matter.Body.setVelocity(birdBody, { x: birdBody.velocity.x, y: JUMP_VELOCITY });
  };

  return (
    <TouchableWithoutFeedback onPress={onTouch}>
      <View style={styles.container}>
        <GameEngine
          ref={gameEngine}
          style={styles.container}
          systems={[Physics]}
          running={running}
          entities={{
            physics: {
              engine: entitiesState.engine,
              world: entitiesState.world,
            },
            bird: {
              body: entitiesState.bird,
              size: [BIRD_WIDTH, BIRD_HEIGHT],
              color: "yellow",
              renderer: Bird,
            },
            ground: {
              body: entitiesState.ground,
              size: [SCREEN_WIDTH, GROUND_HEIGHT],
              renderer: Ground,
            },
            roof: {
              body: entitiesState.roof,
              size: [SCREEN_WIDTH, ROOF_HEIGHT],
              renderer: () => null,
            },
            pipes: entitiesState.pipes,
          }}
          onEvent={(e) => {
            if (e.type === "game-over") onGameOver();
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#70c5ce" },
  bird: { position: "absolute", borderRadius: 10 },
  ground: { position: "absolute", backgroundColor: "brown" },
  pipe: { position: "absolute", backgroundColor: "green" },
});

export default MatterGameEngine;
