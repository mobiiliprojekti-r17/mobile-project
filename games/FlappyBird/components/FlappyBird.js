import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';

import Bird  from './Bird';
import Pipe  from './Pipe';
import Floor from './floor';

import { MAX_WIDTH, MAX_HEIGHT, PIPE_WIDTH, GAP_SIZE } from './constants';
import { db } from '../../../firebase/Config';
import { collection, addDoc } from 'firebase/firestore';
import { useNickname } from '../../../context/context';

let nextPipeId = 1;
const MIN_PIPE_HEIGHT = 120;

const createPipePair = (xPos, world) => {
  const maxGapTop = MAX_HEIGHT - GAP_SIZE - MIN_PIPE_HEIGHT;
  const gapTop    = Math.floor(Math.random() * (maxGapTop - MIN_PIPE_HEIGHT + 1)) + MIN_PIPE_HEIGHT;

  const pipeTopHeight = gapTop;
  const pipeBottomY   = gapTop + GAP_SIZE;
  const pipeBottomHt  = MAX_HEIGHT - pipeBottomY;

  const pipeTop = Matter.Bodies.rectangle(
    xPos, pipeTopHeight / 2, PIPE_WIDTH, pipeTopHeight, { isStatic: true }
  );
  const pipeBottom = Matter.Bodies.rectangle(
    xPos, pipeBottomY + pipeBottomHt / 2, PIPE_WIDTH, pipeBottomHt, { isStatic: true }
  );

  pipeTop.label = pipeBottom.label = 'Pipe';
  Matter.World.add(world, [pipeTop, pipeBottom]);

  return {
    [`pipe${nextPipeId}Top`]   : { body: pipeTop,    scored: false, renderer: Pipe },
    [`pipe${nextPipeId}Bottom`]: { body: pipeBottom, renderer: Pipe },
  };
};

const resetPipes = (entities, world) => {
  Object.keys(entities).forEach(k => {
    if (k.startsWith('pipe')) {
      Matter.World.remove(world, entities[k].body);
      delete entities[k];
    }
  });
  let pipes = createPipePair(MAX_WIDTH * 1.5, world); nextPipeId++;
  pipes = { ...pipes, ...createPipePair(MAX_WIDTH * 2.2, world) }; nextPipeId++;
  return pipes;
};

export default function FlappyBird({ navigation }) {
  const { nickname } = useNickname();

  const [running,  setRunning]  = useState(false); 
  const [gameOver, setGameOver] = useState(false);
  const [score,    setScore]    = useState(0);

  const gameEngineRef   = useRef(null);
  const scoreRef        = useRef(0);    
  const resultSavedRef  = useRef(false); 

  useEffect(() => {
    if (!running && gameOver && scoreRef.current > 0 && !resultSavedRef.current) {
      (async () => {
        try {
          await addDoc(collection(db, 'FlappyBirdResults'), {
            Nickname: nickname,
            score   : scoreRef.current,
          });
          console.log('Saved result:', score);
        } catch (err) {
          console.error('Firestore save failed:', err);
        }
      })();
      resultSavedRef.current = true;
    }
  }, [running, gameOver]);

  const engine = Matter.Engine.create({ enableSleeping: false });
  const world  = engine.world;
  world.gravity.y = 1.2;

  Matter.Events.on(engine, 'collisionStart', e => {
    e.pairs.forEach(p => {
      if (p.bodyA.label === 'Bird' || p.bodyB.label === 'Bird') {
        setGameOver(true);
        setRunning(false);
      }
    });
  });

  const birdVertices = [
    {x:-20,y:-5},{x:-10,y:-12},{x:0,y:-14},{x:12,y:-10},{x:18,y:-4},
    {x:18,y:2},{x:12,y:10},{x:0,y:16},{x:-14,y:12},{x:-20,y:7}
  ];
  const bird = Matter.Bodies.fromVertices(
    MAX_WIDTH/4, MAX_HEIGHT/2, [birdVertices], { label:'Bird' }, true
  );
  Matter.World.add(world, bird);

  const floorBody = Matter.Bodies.rectangle(
    MAX_WIDTH/2, MAX_HEIGHT-25, MAX_WIDTH, 50, { isStatic:true, label:'Floor' }
  );
  const ceilingBody = Matter.Bodies.rectangle(
    MAX_WIDTH/2, 25, MAX_WIDTH, 50, { isStatic:true, label:'Ceiling' }
  );
  Matter.World.add(world, [floorBody, ceilingBody]);

  const entities = {
    physics:{ engine, world },
    bird   :{ body: bird,   renderer: Bird  },
    ceiling:{ body: ceilingBody, renderer: Floor },
    ...resetPipes({}, world),
  };


  const Physics = (entities, { touches, time, dispatch }) => {
    const birdBody = entities.bird.body;

    touches
      .filter(t => t.type === 'press')
      .forEach(() => Matter.Body.setVelocity(birdBody, {x:0, y:-9}));

    Matter.Engine.update(entities.physics.engine, Math.min(time.delta, 16));

    const pipePairs = {};
    Object.keys(entities).filter(k=>k.startsWith('pipe')).forEach(k=>{
      const id = k.includes('Top') ? k.replace('Top','') : k.replace('Bottom','');
      pipePairs[id] = pipePairs[id] || {};
      pipePairs[id][k.includes('Top') ? 'top' : 'bottom'] = entities[k];
    });

    Object.values(pipePairs).forEach(pair => {
      Matter.Body.translate(pair.top.body,    {x:-2, y:0});
      Matter.Body.translate(pair.bottom.body, {x:-2, y:0});

      if (pair.top.body.position.x < birdBody.position.x && !pair.top.scored) {
        pair.top.scored = true;
        dispatch({ type:'score' });
      }

      if (pair.top.body.position.x < -PIPE_WIDTH) {
        const maxGapTop = MAX_HEIGHT - GAP_SIZE - MIN_PIPE_HEIGHT;
        const gapTop    = Math.floor(Math.random() *
                         (maxGapTop - MIN_PIPE_HEIGHT + 1)) + MIN_PIPE_HEIGHT;

        const topHt = gapTop;
        const botY  = gapTop + GAP_SIZE;
        const botHt = MAX_HEIGHT - botY;

        Matter.Body.setPosition(pair.top.body,
          { x: MAX_WIDTH*1.5, y: topHt/2 });
        Matter.Body.setPosition(pair.bottom.body,
          { x: MAX_WIDTH*1.5, y: botY + botHt/2 });

        Matter.Body.setVertices(pair.top.body,
          Matter.Vertices.fromPath(`0 0 ${PIPE_WIDTH} 0 ${PIPE_WIDTH} ${topHt} 0 ${topHt}`));
        Matter.Body.setVertices(pair.bottom.body,
          Matter.Vertices.fromPath(`0 0 ${PIPE_WIDTH} 0 ${PIPE_WIDTH} ${botHt} 0 ${botHt}`));

        pair.top.scored = false;
      }
    });

    if (birdBody.position.y > MAX_HEIGHT || birdBody.position.y < 0) {
      dispatch({ type:'game-over' });
    }
    return entities;
  };

  const onEvent = (e) => {
    if (e.type === 'score') {
      setScore(prev => {
        const s = prev + 1;
        scoreRef.current = s;
        return s;
      });
    } else if (e.type === 'game-over') {

      setGameOver(true);
      setRunning(false);
    }
  };

  const resetGame = () => {
    const newEngine = Matter.Engine.create({ enableSleeping:false });
    const newWorld  = newEngine.world; newWorld.gravity.y = 1.2;

    Matter.Events.on(newEngine,'collisionStart',e=>{
      e.pairs.forEach(p=>{
        if (p.bodyA.label==='Bird'||p.bodyB.label==='Bird') {
          setGameOver(true);
          setRunning(false);
        }
      });
    });

    const newBird = Matter.Bodies.fromVertices(
      MAX_WIDTH/4, MAX_HEIGHT/2, [birdVertices], { label:'Bird' }, true
    );
    const newFloor = Matter.Bodies.rectangle(
      MAX_WIDTH/2, MAX_HEIGHT-25, MAX_WIDTH, 50, { isStatic:true, label:'Floor' }
    );
    const newCeil  = Matter.Bodies.rectangle(
      MAX_WIDTH/2, 25, MAX_WIDTH, 50, { isStatic:true, label:'Ceiling' }
    );
    Matter.World.add(newWorld, [newBird, newFloor, newCeil]);

    const newEntities = {
      physics:{ engine:newEngine, world:newWorld },
      bird   :{ body:newBird,  renderer: Bird  },
      floor  :{ body:newFloor, renderer: Floor },
      ceiling:{ body:newCeil,  renderer: Floor },
      ...resetPipes({}, newWorld),
    };
    gameEngineRef.current.swap(newEntities);

    scoreRef.current      = 0;
    setScore(0);
    setGameOver(false);
    resultSavedRef.current = false;
    setRunning(false); 
  };

  return (
    <View style={styles.container}>
      <GameEngine
        ref={gameEngineRef}
        systems={running ? [Physics] : []} 
        entities={entities}
        running={running}
        onEvent={onEvent}
        style={styles.gameContainer}
      />

      <Text style={styles.scoreText}>{score}</Text>

      {!running && !gameOver && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.overlay}
          onPress={() => setRunning(true)}
        >
          <Text style={styles.gameOverText}>Press To Start</Text>
        </TouchableOpacity>
      )}

      {!running && gameOver && (
        <View style={styles.overlay}>
          <Text style={styles.gameOverText}>Game Over!</Text>

          <TouchableOpacity style={styles.button} onPress={resetGame}>
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              navigation.navigate('FlappyBirdResult', {
                Nickname: nickname,
                score   : scoreRef.current,
              })
            }>
            <Text style={styles.buttonText}>Results</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container:{ flex:1 },
  gameContainer:{ flex:1 },
  scoreText:{
    position:'absolute', top:50, left:20,
    fontSize:60, fontWeight:'bold', color:'white',
    fontFamily: 'Silkscreen_400Regular',
    textShadowColor:'black', textShadowOffset:{ width:2, height:2 }, textShadowRadius:10,
  },
  overlay:{
    position:'absolute', top:0, left:0, right:0, bottom:0,
    justifyContent:'center', alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.4)',
    zIndex: 20, 
  },
  gameOverText:{
    fontSize:30, color:'white', fontWeight:'bold', marginBottom:20, textAlign:'center', fontFamily: 'Silkscreen_400Regular',
  },
  button:{
    backgroundColor:'rgb(159,228,70)', width:150, height:45, borderRadius:8,
    justifyContent:'center', alignItems:'center', marginVertical:10,
  },
  buttonText:{ color:'#fff', fontSize:20, fontWeight:'bold',  fontFamily: 'Silkscreen_400Regular',
  },
});


