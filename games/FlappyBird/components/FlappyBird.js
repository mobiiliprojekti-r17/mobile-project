
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';
import Bird from './Bird';
import Pipe from './Pipe';
import Floor from './floor';
import { MAX_WIDTH, MAX_HEIGHT, PIPE_WIDTH, GAP_SIZE } from './constants';
import { db } from "../../../firebase/Config";
import { collection, addDoc } from "firebase/firestore";
import { useNickname } from "../../../context/context";


let nextPipeId = 1;

const MIN_PIPE_HEIGHT = 120;

const createPipePair = (xPos, world) => {
  const maxGapTop = MAX_HEIGHT - GAP_SIZE - MIN_PIPE_HEIGHT;
  const gapTop = Math.floor(Math.random() * (maxGapTop - MIN_PIPE_HEIGHT + 1)) + MIN_PIPE_HEIGHT;

  const pipeTopHeight = gapTop;
  const pipeBottomY = gapTop + GAP_SIZE;
  const pipeBottomHeight = MAX_HEIGHT - pipeBottomY;

  const pipeTop = Matter.Bodies.rectangle(
    xPos,
    pipeTopHeight / 2,
    PIPE_WIDTH,
    pipeTopHeight,
    { isStatic: true }
  );
  const pipeBottom = Matter.Bodies.rectangle(
    xPos,
    pipeBottomY + pipeBottomHeight / 2,
    PIPE_WIDTH,
    pipeBottomHeight,
    { isStatic: true }
  );

  pipeTop.label = "Pipe";
  pipeBottom.label = "Pipe";

  Matter.World.add(world, [pipeTop, pipeBottom]);

  return {
    [`pipe${nextPipeId}Top`]: { body: pipeTop, scored: false, renderer: Pipe },
    [`pipe${nextPipeId}Bottom`]: { body: pipeBottom, renderer: Pipe }
  };
};

const resetPipes = (entities, world) => {
  Object.keys(entities).forEach(key => {
    if (key.startsWith("pipe")) {
      Matter.World.remove(world, entities[key].body);
      delete entities[key];
    }
  });
  let pipes = createPipePair(MAX_WIDTH * 1.5, world);
  nextPipeId++;
  pipes = {
    ...pipes,
    ...createPipePair(MAX_WIDTH * 2.2, world)
  };
  nextPipeId++;
  return pipes;
};

export default function FlappyBird({navigation}) {
  const { nickname } = useNickname();
  const [running, setRunning] = useState(true);
  const [score, setScore] = useState(0);
  const gameEngineRef = useRef(null);

  const storeResult = async () => {
    try {
      await addDoc(collection(db, "FlappyBirdResults"), {
        Nickname: nickname,
        score: score,
      });
      console.log("Result stored in Firestore.");
      navigation.navigate("FlappyBirdResult", {
        Nickname: nickname,
        score: score,
      });
    } catch (error) {
      console.error("Error storing result: ", error);
    }
  };

  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  world.gravity.y = 1.2;

  Matter.Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(pair => {
      if (pair.bodyA.label === "Bird" || pair.bodyB.label === "Bird") {
        setRunning(false);
      }
    });
  });
  //-----------------------------------------------------------------------------

  const birdVertices = [
    { x: -20, y: -5 },  // left wing / tail top
    { x: -10, y: -12 }, // upper-left
    { x: 0,   y: -14 }, // top-center
    { x: 12,  y: -10 }, // top-right
    { x: 18,  y: -4 },  // beak (top)
    { x: 18,  y: 2 },   // beak (bottom)
    { x: 12,  y: 10 },  // lower-right
    { x: 0,   y: 16 },  // bottom-center
    { x: -14, y: 12 },  // lower-left
    { x: -20, y: 7 }    // tail bottom
  ];
  
  const bird = Matter.Bodies.fromVertices(
    MAX_WIDTH / 4,  // x-position of bird center
    MAX_HEIGHT / 2, // y-position of bird center
    [birdVertices], // Wrap your vertex array in another array
    {
      label: "Bird", 
    },
    true 
  );
  Matter.World.add(world, bird);

  //-----------------------------------------------------------------------------
/*
  const bird = Matter.Bodies.rectangle(MAX_WIDTH / 4, MAX_HEIGHT / 2, 50, 50);
  bird.label = "Bird";
  Matter.World.add(world, bird);
*/
//--------------------------------------------------------------------------------
  const floorHeight = 50;
  const floorBody = Matter.Bodies.rectangle(MAX_WIDTH / 2, MAX_HEIGHT - floorHeight / 2, MAX_WIDTH, floorHeight, { isStatic: true });
  floorBody.label = "Floor";

  const ceilingBody = Matter.Bodies.rectangle(MAX_WIDTH / 2, floorHeight / 2, MAX_WIDTH, floorHeight, { isStatic: true });
  ceilingBody.label = "Ceiling";

  Matter.World.add(world, [floorBody, ceilingBody]);

  const initialPipes = resetPipes({}, world);

  const entities = {
    physics: { engine: engine, world: world },
    bird: { body: bird, renderer: Bird },
    floor: { body: floorBody, renderer: Floor },
    ceiling: { body: ceilingBody, renderer: Floor },
    ...initialPipes
  };

  const Physics = (entities, { touches, time, dispatch }) => {
    const engine = entities.physics.engine;
    const bird = entities.bird.body;

    touches.filter(t => t.type === "press").forEach(() => {
      Matter.Body.setVelocity(bird, { x: 0, y: -10 });
    });

      const fixedDelta = Math.min(time.delta, 16.000);
      Matter.Engine.update(engine, fixedDelta);

    const pipePairs = {};
    Object.keys(entities)
      .filter(key => key.startsWith("pipe"))
      .forEach(key => {
        const pairId = key.includes("Top") ? key.replace("Top", "") : key.replace("Bottom", "");
        pipePairs[pairId] = pipePairs[pairId] || {};
        if (key.includes("Top")) {
          pipePairs[pairId].top = entities[key];
        } else {
          pipePairs[pairId].bottom = entities[key];
        }
      });

    Object.keys(pipePairs).forEach(pairId => {
      const pair = pipePairs[pairId];
      Matter.Body.translate(pair.top.body, { x: -2, y: 0 });
      Matter.Body.translate(pair.bottom.body, { x: -2, y: 0 });

      if (pair.top.body.position.x < bird.position.x && !pair.top.scored) {
        pair.top.scored = true;
        dispatch({ type: "score" });
      }

      if (pair.top.body.position.x < -PIPE_WIDTH) {
        const maxGapTop = MAX_HEIGHT - GAP_SIZE - MIN_PIPE_HEIGHT;
        const gapTop = Math.floor(Math.random() * (maxGapTop - MIN_PIPE_HEIGHT + 1)) + MIN_PIPE_HEIGHT;

        const pipeTopHeight = gapTop;
        const pipeBottomY = gapTop + GAP_SIZE;
        const pipeBottomHeight = MAX_HEIGHT - pipeBottomY;

        Matter.Body.setPosition(pair.top.body, {
          x: MAX_WIDTH * 1.5,
          y: pipeTopHeight / 2,
        });

        Matter.Body.setPosition(pair.bottom.body, {
          x: MAX_WIDTH * 1.5,
          y: pipeBottomY + pipeBottomHeight / 2,
        });

        Matter.Body.setVertices(pair.top.body, Matter.Vertices.fromPath(`0 0 ${PIPE_WIDTH} 0 ${PIPE_WIDTH} ${pipeTopHeight} 0 ${pipeTopHeight}`));
        Matter.Body.setVertices(pair.bottom.body, Matter.Vertices.fromPath(`0 0 ${PIPE_WIDTH} 0 ${PIPE_WIDTH} ${pipeBottomHeight} 0 ${pipeBottomHeight}`));

        pair.top.scored = false;
      }
    });

    if (bird.position.y > MAX_HEIGHT || bird.position.y < 0) {
      dispatch({ type: "game-over" });
    }

    return entities;
  };

  const onEvent = (e) => {
    if (e.type === "score") {
      setScore(score + 1);
    } else if (e.type === "game-over") {
      setRunning(false);
    }
  };

  const resetGame = () => {
    const engine = Matter.Engine.create({ enableSleeping: false });
    const world = engine.world;
    world.gravity.y = 1.2;

    Matter.Events.on(engine, 'collisionStart', event => {
      event.pairs.forEach(pair => {
        if (pair.bodyA.label === "Bird" || pair.bodyB.label === "Bird") {
          setRunning(false);
        }
      });
    });
    //------------------------------------------
/*
    const bird = Matter.Bodies.rectangle(MAX_WIDTH / 4, MAX_HEIGHT / 2, 50, 50);
    bird.label = "Bird";
    Matter.World.add(world, bird);
*/

const birdVertices = [
    { x: -20, y: -5 },  // left wing / tail top
    { x: -10, y: -12 }, // upper-left
    { x: 0,   y: -14 }, // top-center
    { x: 12,  y: -10 }, // top-right
    { x: 18,  y: -4 },  // beak (top)
    { x: 18,  y: 2 },   // beak (bottom)
    { x: 12,  y: 10 },  // lower-right
    { x: 0,   y: 16 },  // bottom-center
    { x: -14, y: 12 },  // lower-left
    { x: -20, y: 7 }    // tail bottom
  ];
  
  const bird = Matter.Bodies.fromVertices(
    MAX_WIDTH / 4,  // x-position of bird center
    MAX_HEIGHT / 2, // y-position of bird center
    [birdVertices], // Wrap your vertex array in another array
    {
      label: "Bird", 
    },
    true 
  );
  Matter.World.add(world, bird);
  //--------------------------------------------
    const floorBody = Matter.Bodies.rectangle(MAX_WIDTH / 2, MAX_HEIGHT - 25, MAX_WIDTH, 50, { isStatic: true });
    floorBody.label = "Floor";

    const ceilingBody = Matter.Bodies.rectangle(MAX_WIDTH / 2, 25, MAX_WIDTH, 50, { isStatic: true });
    ceilingBody.label = "Ceiling";

    Matter.World.add(world, [floorBody, ceilingBody]);

    const newPipes = resetPipes({}, world);

    const newEntities = {
      physics: { engine: engine, world: world },
      bird: { body: bird, renderer: Bird },
      floor: { body: floorBody, renderer: Floor },
      ceiling: { body: ceilingBody, renderer: Floor },
      ...newPipes
    };

    gameEngineRef.current.swap(newEntities);
    setScore(0);
    setRunning(true);
  };


  return (
    <View style={styles.container}>
      <GameEngine
        ref={gameEngineRef}
        style={styles.gameContainer}
        systems={[Physics]}
        entities={entities}
        running={running}
        onEvent={onEvent}
      />
      <Text style={styles.scoreText}>{score}</Text>
      {!running && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>Game Over!</Text>
          <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              storeResult().then(() => {
                navigation.navigate("FlappyBirdResult", {
                  Nickname: nickname,
                  score: score,
                });
              });
            }}
          >
            <Text style={styles.buttonText}>Results</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: "#71C5CF",
    },
    scoreText: {
      position: 'absolute',
      top: 50,
      left: 20,
      fontSize: 48,
      fontWeight: 'bold',
      color: 'white',
      textShadowColor: 'black',
      textShadowOffset: { width: 2, height: 2 },
      textShadowRadius: 2,
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    gameOverText: {
      fontSize: 30,
      color: 'white',
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
    },
    button: {
      backgroundColor: "rgb(159, 228, 70)",
      width: 150,
      height: 45,
      borderRadius: 8,
      elevation: 3,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  