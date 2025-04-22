// Tuodaan React, React Native ja Matter.js -kirjastot sekä pelin komponentit
import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';

// Tuodaan omat komponentit ja vakioarvot
import Bird from './Bird';
import Pipe from './Pipe';
import Floor from './floor';
import { MAX_WIDTH, MAX_HEIGHT, PIPE_WIDTH, GAP_SIZE } from './constants';

// Firestore ja käyttäjänimi
import { db } from '../../../firebase/Config';
import { collection, addDoc } from 'firebase/firestore';
import { useNickname } from '../../../context/context';
import FlappyStyles from '../FlappyStyles/FlappyBirdStyles';

// Automaattinen putkien tunnisteiden laskuri ja minimikorkeus
let nextPipeId = 1;
const MIN_PIPE_HEIGHT = 120;

/**
 * Luo pari putkia satunnaisella aukon sijainnilla
 * @param {number} xPos Putkien alkukohta x-koordinaatissa
 * @param {Matter.World} world Fysiikkamaailma, johon putket lisätään
 * @returns {object} Entiteetit pipeTop ja pipeBottom renderöintikomponentteineen
 */
const createPipePair = (xPos, world) => {
  // Lasketaan aukon yläreunan suurin sallittu sijainti
  const maxGapTop = MAX_HEIGHT - GAP_SIZE - MIN_PIPE_HEIGHT;
  // Satunnainen aukon koko
  const gapTop = Math.floor(
    Math.random() * (maxGapTop - MIN_PIPE_HEIGHT + 1)
  ) + MIN_PIPE_HEIGHT;

  // Putkien mitat ja sijainnit
  const pipeTopHeight = gapTop;
  const pipeBottomY = gapTop + GAP_SIZE;
  const pipeBottomHeight = MAX_HEIGHT - pipeBottomY;

  // Luodaan fysiikka ylä- ja alapuolen putkille
  const pipeTop = Matter.Bodies.rectangle(
    xPos,
    pipeTopHeight / 2,
    PIPE_WIDTH,
    pipeTopHeight,
    { isStatic: true, label: 'Pipe' }
  );
  const pipeBottom = Matter.Bodies.rectangle(
    xPos,
    pipeBottomY + pipeBottomHeight / 2,
    PIPE_WIDTH,
    pipeBottomHeight,
    { isStatic: true, label: 'Pipe' }
  );

  // Lisätään putket maailmaan
  Matter.World.add(world, [pipeTop, pipeBottom]);

  // Palautetaan entiteetit renderöintikomponentteineen
  return {
    [`pipe${nextPipeId}Top`]: {
      body: pipeTop,
      scored: false,       // Seurataan, onko piste annettu
      renderer: Pipe,
    },
    [`pipe${nextPipeId}Bottom`]: {
      body: pipeBottom,
      renderer: Pipe,
    },
  };
};

/**
 * Poistaa vanhat putket ja luo kaksi uutta putkiparia
 * @param {object} entities Nykyiset entiteetit
 * @param {Matter.World} world Fysiikkamaailma
 * @returns {object} Uudet putki-entiteetit
 */
const resetPipes = (entities, world) => {
  // Poistetaan kaikki aiemmat putket
  Object.keys(entities).forEach((key) => {
    if (key.startsWith('pipe')) {
      Matter.World.remove(world, entities[key].body);
      delete entities[key];
    }
  });

  // Luodaan kaksi putkiparia eri x-koordinaateilla
  let pipes = createPipePair(MAX_WIDTH * 1.5, world);
  nextPipeId++;
  pipes = {
    ...pipes,
    ...createPipePair(MAX_WIDTH * 2.2, world),
  };
  nextPipeId++;
  return pipes;
};


// Pääkomponentti: ylläpitää pelin tilaa ja renderöi GameEngine-komponentin
 
export default function FlappyBird({ navigation }) {
  const { nickname } = useNickname();  // Käyttäjän lempinimi

  // Pelin tilat: käynnissä, ohi, pistemäärä
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  // Ref-muuttujat pistemäärälle ja tallennuksen estolle
  const gameEngineRef = useRef(null);
  const scoreRef = useRef(0);
  const resultSavedRef = useRef(false);

  // Tallennetaan tulos Firestoreen, kun peli loppunut ensimmäistä kertaa
  useEffect(() => {
    if (!running && gameOver && scoreRef.current > 0 && !resultSavedRef.current) {
      (async () => {
        try {
          await addDoc(collection(db, 'FlappyBirdResults'), {
            Nickname: nickname,
            score: scoreRef.current,
          });
        } catch (err) {
          console.error('Tuloksen tallennus epäonnistui:', err);
        }
      })();
      resultSavedRef.current = true;
    }
  }, [running, gameOver]);

  // Alustetaan Matter.js moottori ja maailma
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  world.gravity.y = 1.2;  // Painovoima

  // Kuunnellaan törmäystapahtumat lintuun
  Matter.Events.on(engine, 'collisionStart', (evt) => {
    evt.pairs.forEach((pair) => {
      if (pair.bodyA.label === 'Bird' || pair.bodyB.label === 'Bird') {
        setGameOver(true);
        setRunning(false);
      }
    });
  });

  // Määritellään lintukehon muoto polygoneilla
  const birdVertices = [
    { x: -20, y: -5 }, { x: -10, y: -12 }, { x: 0, y: -14 },
    { x: 12, y: -10 }, { x: 18, y: -4 }, { x: 18, y: 2 },
    { x: 12, y: 10 }, { x: 0, y: 16 }, { x: -14, y: 12 },
    { x: -20, y: 7 }
  ];
  const bird = Matter.Bodies.fromVertices(
    MAX_WIDTH / 4,
    MAX_HEIGHT / 2,
    [birdVertices],
    { label: 'Bird' },
    true
  );
  Matter.World.add(world, bird);

  // Lisätään lattia ja katto rajaksi
  const floorBody = Matter.Bodies.rectangle(
    MAX_WIDTH / 2,
    MAX_HEIGHT - 25,
    MAX_WIDTH,
    50,
    { isStatic: true, label: 'Floor' }
  );
  const ceilingBody = Matter.Bodies.rectangle(
    MAX_WIDTH / 2,
    25,
    MAX_WIDTH,
    50,
    { isStatic: true, label: 'Ceiling' }
  );
  Matter.World.add(world, [floorBody, ceilingBody]);

  // Rakennetaan pelin entiteetit
  const entities = {
    physics: { engine, world },
    bird: { body: bird, renderer: Bird },
    floor: { body: floorBody, renderer: Floor },
    ceiling: { body: ceilingBody, renderer: Floor },
    ...resetPipes({}, world),
  };

  
   // Physics-system: käsittelee kosketukset, päivittää fysiikan ja siirtää putkia
   
  const Physics = (entities, { touches, time, dispatch }) => {
    const birdBody = entities.bird.body;

    // Kosketus = lintu hyppää
    touches
      .filter(t => t.type === 'press')
      .forEach(() => Matter.Body.setVelocity(birdBody, { x: 0, y: -9 }));

    // Päivitä fysiikkamoottori
    Matter.Engine.update(entities.physics.engine, Math.min(time.delta, 16));

    // Ryhmitä putket pareiksi tunnisteen mukaan
    const pipePairs = {};
    Object.keys(entities)
      .filter(key => key.startsWith('pipe'))
      .forEach(key => {
        const id = key.includes('Top') ? key.replace('Top','') : key.replace('Bottom','');
        pipePairs[id] = pipePairs[id] || {};
        pipePairs[id][ key.includes('Top') ? 'top' : 'bottom'] = entities[key];
      });

    // Siirrä ja käsittele jokainen putkipari
    Object.values(pipePairs).forEach(pair => {
      // Liikuta vasemmalle
      Matter.Body.translate(pair.top.body,    { x: -2, y: 0 });
      Matter.Body.translate(pair.bottom.body, { x: -2, y: 0 });

      // Piste, kun lintu ylittää putken
      if (pair.top.body.position.x < birdBody.position.x && !pair.top.scored) {
        pair.top.scored = true;
        dispatch({ type: 'score' });
      }

      // Putki poistuu näytöltä -> nollaa paikka ja aukon sijainti
      if (pair.top.body.position.x < -PIPE_WIDTH) {
        const maxGapTop = MAX_HEIGHT - GAP_SIZE - MIN_PIPE_HEIGHT;
        const gapTop = Math.floor(
          Math.random() * (maxGapTop - MIN_PIPE_HEIGHT + 1)
        ) + MIN_PIPE_HEIGHT;
        const topHeight = gapTop;
        const bottomY = gapTop + GAP_SIZE;
        const bottomHeight = MAX_HEIGHT - bottomY;

        Matter.Body.setPosition(pair.top.body,    { x: MAX_WIDTH*1.5, y: topHeight/2 });
        Matter.Body.setPosition(pair.bottom.body, { x: MAX_WIDTH*1.5, y: bottomY + bottomHeight/2 });

        Matter.Body.setVertices(
          pair.top.body,
          Matter.Vertices.fromPath(`0 0 ${PIPE_WIDTH} 0 ${PIPE_WIDTH} ${topHeight} 0 ${topHeight}`)
        );
        Matter.Body.setVertices(
          pair.bottom.body,
          Matter.Vertices.fromPath(`0 0 ${PIPE_WIDTH} 0 ${PIPE_WIDTH} ${bottomHeight} 0 ${bottomHeight}`)
        );

        pair.top.scored = false;
      }
    });

    // Peli ohi, jos lintu putoaa ruudun ulkopuolelle
    if (birdBody.position.y > MAX_HEIGHT || birdBody.position.y < 0) {
      dispatch({ type: 'game-over' });
    }

    return entities;
  };

  
    // Käsittelee tapahtumat (pisteet ja pelin loppu)

  const onEvent = (event) => {
    if (event.type === 'score') {
      setScore(prev => {
        const newScore = prev + 1;
        scoreRef.current = newScore;
        return newScore;
      });
    } else if (event.type === 'game-over') {
      setGameOver(true);
      setRunning(false);
    }
  };

  
   // Resetoi pelin: luo uuden fysiikkamoottorin, entiteetit ja tilat
   
  const resetGame = () => {
    const newEngine = Matter.Engine.create({ enableSleeping: false });
    const newWorld = newEngine.world;
    newWorld.gravity.y = 1.2;

    Matter.Events.on(newEngine, 'collisionStart', evt => {
      evt.pairs.forEach(pair => {
        if (pair.bodyA.label === 'Bird' || pair.bodyB.label === 'Bird') {
          setGameOver(true);
          setRunning(false);
        }
      });
    });

    const newBird = Matter.Bodies.fromVertices(
      MAX_WIDTH / 4,
      MAX_HEIGHT / 2,
      [birdVertices],
      { label: 'Bird' },
      true
    );
    const newFloor = Matter.Bodies.rectangle(
      MAX_WIDTH / 2,
      MAX_HEIGHT - 25,
      MAX_WIDTH,
      50,
      { isStatic: true, label: 'Floor' }
    );
    const newCeil = Matter.Bodies.rectangle(
      MAX_WIDTH / 2,
      25,
      MAX_WIDTH,
      50,
      { isStatic: true, label: 'Ceiling' }
    );
    Matter.World.add(newWorld, [newBird, newFloor, newCeil]);

    const newEntities = {
      physics: { engine: newEngine, world: newWorld },
      bird: { body: newBird, renderer: Bird },
      floor: { body: newFloor, renderer: Floor },
      ceiling: { body: newCeil, renderer: Floor },
      ...resetPipes({}, newWorld),
    };
    gameEngineRef.current.swap(newEntities);

    scoreRef.current = 0;
    setScore(0);
    setGameOver(false);
    resultSavedRef.current = false;
    setRunning(false);
  };

  // JSX-rakenne: GameEngine, pistemäärä ja overlayt
  return (
    <View style={FlappyStyles.container}>
      <GameEngine
        ref={gameEngineRef}
        systems={running ? [Physics] : []}
        entities={entities}
        running={running}
        onEvent={onEvent}
        style={FlappyStyles.gameContainer}
      />

      <Text style={FlappyStyles.scoreText}>{score}</Text>

      {/* Aloitusnäyttö ennen pelin alkua */}
      {!running && !gameOver && (
        <TouchableOpacity
          activeOpacity={0.8}
          style={FlappyStyles.overlay}
          onPress={() => setRunning(true)}
        >
          <Text style={FlappyStyles.gameOverText}>Press To Start</Text>
        </TouchableOpacity>
      )}

      {/* Näyttö, kun peli on ohi */}
      {!running && gameOver && (
        <View style={FlappyStyles.overlay}>
          <Text style={FlappyStyles.gameOverText}>Game Over!</Text>
          <TouchableOpacity style={FlappyStyles.button} onPress={resetGame}>
            <Text style={FlappyStyles.buttonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={FlappyStyles.button}
            onPress={() =>
              navigation.navigate('FlappyBirdResult', {
                Nickname: nickname,
                score: scoreRef.current,
              })
            }
          >
            <Text style={FlappyStyles.buttonText}>Results</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

// Tyylit (jos tarvitaan paikallinen StyleSheet):
const styles = StyleSheet.create({});
