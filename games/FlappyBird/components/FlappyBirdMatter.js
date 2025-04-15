
import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { GameEngine } from "react-native-game-engine";
import Matter from "matter-js";
import Bird from "./Bird";
import Pipe from "./Pipe";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 60;
const PIPE_GAP = 200; 
const GROUND_HEIGHT = 50;
const ROOF_HEIGHT = 30;
const GRAVITY = 0.7;
const JUMP_VELOCITY = -8;
const PIPE_SPEED = 2; 


const Ground = ({ body, size }) => {
  const x = body.position.x - size[0] / 2;
  const y = body.position.y - size[1] / 2;
  return (
    <View style={[styles.ground, { left: x, top: y, width: size[0], height: size[1] }]} />
  );
};

const createPipePair = (offsetX) => {
  const minGapY = 50;
  const maxGapY = SCREEN_HEIGHT - GROUND_HEIGHT - PIPE_GAP - 50;
  const gapY = Math.floor(Math.random() * (maxGapY - minGapY + 1)) + minGapY;

  const topHeight = gapY;
  const bottomHeight = SCREEN_HEIGHT - GROUND_HEIGHT - gapY - PIPE_GAP;
  
  const topPipe = Matter.Bodies.rectangle(
    offsetX,
    topHeight / 2,
    PIPE_WIDTH,
    topHeight,
    { isStatic: true }
  );
  const bottomPipe = Matter.Bodies.rectangle(
    offsetX,
    gapY + PIPE_GAP + bottomHeight / 2,
    PIPE_WIDTH,
    bottomHeight,
    { isStatic: true }
  );

  return {
    topPipe: {
      body: topPipe,
      size: [PIPE_WIDTH, topHeight],
      scored: false,
      renderer: Pipe,
    },
    bottomPipe: {
      body: bottomPipe,
      size: [PIPE_WIDTH, bottomHeight],
      renderer: Pipe,
    },
  };
};


const setupWorld = () => {
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  world.gravity.y = GRAVITY;

  const bird = Matter.Bodies.rectangle(
    50,
    SCREEN_HEIGHT / 2,
    BIRD_WIDTH,
    BIRD_HEIGHT
  );

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


  const pipes = [
    createPipePair(SCREEN_WIDTH + 100),
    createPipePair(SCREEN_WIDTH + 300),
    createPipePair(SCREEN_WIDTH + 500),
  ];

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

const Physics = (entities, { dispatch }) => {
  const { engine } = entities.physics;
  Matter.Engine.update(engine, 16);
  const birdBody = entities.bird.body;
  
  if (entities._pipes && Array.isArray(entities._pipes)) {
    entities._pipes.forEach((pipePair) => {
      const { topPipe, bottomPipe } = pipePair;
      
      Matter.Body.translate(topPipe.body, { x: -PIPE_SPEED, y: 0 });
      Matter.Body.translate(bottomPipe.body, { x: -PIPE_SPEED, y: 0 });
      
      const pipeX = topPipe.body.position.x;
        if (pipeX < -PIPE_WIDTH / 2) {
        const newPair = createPipePair(SCREEN_WIDTH + 100);
        Matter.Body.setPosition(topPipe.body, newPair.topPipe.body.position);
        Matter.Body.setPosition(bottomPipe.body, newPair.bottomPipe.body.position);
        topPipe.size = newPair.topPipe.size;
        bottomPipe.size = newPair.bottomPipe.size;
        topPipe.scored = false;
      }
      
      const birdHalfWidth = BIRD_WIDTH / 2;
      const birdHalfHeight = BIRD_HEIGHT / 2;
      const birdLeft = birdBody.position.x - birdHalfWidth;
      const birdRight = birdBody.position.x + birdHalfWidth;
      const birdTop = birdBody.position.y - birdHalfHeight;
      const birdBottom = birdBody.position.y + birdHalfHeight;
      
      const pipeCenterX = topPipe.body.position.x;
      const pipeLeft = pipeCenterX - PIPE_WIDTH / 2;
      const pipeRight = pipeCenterX + PIPE_WIDTH / 2;
      
      const gapTop = topPipe.size[1];
      const gapBottom = gapTop + PIPE_GAP; 
      
      if (birdRight > pipeLeft && birdLeft < pipeRight) {
        if (birdTop < gapTop || birdBottom > gapBottom) {
          dispatch({ type: "game-over" });
        }
      }
      
      if (pipeRight < birdLeft && !topPipe.scored) {
        if (birdTop >= gapTop && birdBottom <= gapBottom) {
          topPipe.scored = true;
          dispatch({ type: "score" });
        }
      }
    });
  }
  
  const collisionWithGround =
    Matter.Collision.collides(birdBody, entities.ground.body) || {};
  const collisionWithRoof =
    Matter.Collision.collides(birdBody, entities.roof.body) || {};
  if (collisionWithGround.collided || collisionWithRoof.collided) {
    dispatch({ type: "game-over" });
  }
  
  return entities;
};


const MatterGameEngine = ({ running, onGameOver }) => {
  const gameEngine = useRef(null);
  const [entitiesState] = useState(setupWorld());

  const onTouch = () => {
    Matter.Body.setVelocity(entitiesState.bird, {
      x: entitiesState.bird.velocity.x,
      y: JUMP_VELOCITY,
    });
  };

  const flattenedPipes = entitiesState.pipes.reduce((acc, pipePair, index) => {
    acc[`topPipe${index}`] = pipePair.topPipe;
    acc[`bottomPipe${index}`] = pipePair.bottomPipe;
    return acc;
  }, {});

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

            _pipes: entitiesState.pipes,
            ...flattenedPipes,
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
  pipe: {
    position: "absolute",
    backgroundColor: "green",
    borderWidth: 1,
    borderColor: "#004400",
  },
});

export default MatterGameEngine;
