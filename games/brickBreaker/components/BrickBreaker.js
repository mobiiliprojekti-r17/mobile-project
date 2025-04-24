// Tuodaan tarvittavat kirjastot ja moduulit
import React, { useRef, useState, useMemo, useCallback } from 'react';
import {
  View,
  StyleSheet,
  PanResponder,
  Text,
  Button,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { GameEngine } from 'react-native-game-engine';
import Matter from 'matter-js';

// Renderöintikomponentit: maila, pallo ja tiili
import { Paddle, Ball, Brick } from './BrickBreakRender';
// Fysiikkajärjestelmä, joka päivittää maailman tilan
import { Physics } from '../utils/BrickPhysics';
// Navigaatio ja fokuseffect käytettäväksi komponentin sisällä
import { useNavigation, useFocusEffect } from '@react-navigation/native';
// Firebase-kirjastot tulosten tallennusta varten
import { db } from '../../../firebase/Config';
import { collection, addDoc } from 'firebase/firestore';
// Konteksti, josta saadaan pelaajan lempinimi
import { useNickname } from '../../../context/context';
// Tyylit pelinäkymälle
import BreakerStyles from '../styles/BreakerStyles';

// Näytön skaalaus
// Haetaan ruudun leveys, laskemme skaalauskertoimen suhteessa perusleveyteen 400
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BASE_WIDTH = 400;
const scaleFactor = SCREEN_WIDTH / BASE_WIDTH;

// Matter.js resolverin parametrit
// Pienennetään lepovärinää ja hidastusta, jotta simulointi pysyy vakaana
Matter.Resolver._restingThresh = 0.001;
Matter.Resolver._positionDampen = 0.01;
Matter.Resolver._positionWarming = 0.01;
Matter.Resolver._frictionNormalMultiplier = 1.0;

// Apufunktio satunnaisten indeksiä valintaan
// count: montako indekstiä valitaan, total: kokonaislkm,
// excludeSet: mahdolliset sulkupakkauksessa olevat indeksit
const getRandomIndices = (count, total, excludeSet = new Set()) => {
  const indices = new Set();
  while (indices.size < count) {
    const idx = Math.floor(Math.random() * total);
    if (!excludeSet.has(idx)) {
      indices.add(idx);
    }
  }
  return indices;
};

// setupWorld
// Alustaa pelin fysiikkamaailman, luo pallon, mailan, seinät ja tiilet
// Palauttaa objektin, jossa on engine, world, olioiden viitteet ja taso
const setupWorld = (level = 1) => {
  // Luo engine ilman nukahtamista
  const engine = Matter.Engine.create({ enableSleeping: false });
  const world = engine.world;
  // Poistetaan painovoima y-suunnassa
  engine.world.gravity.y = 0;

  // Pallo
  // Keskitetään x=200, y=350 skaalauskertoimella kerrottuna
  // Säädetään kimmoisuus, kitkat ym.
  const ball = Matter.Bodies.circle(
    200 * scaleFactor,
    350 * scaleFactor,
    10 * scaleFactor,
    {
      isStatic: false,
      label: 'ball',
      restitution: 1.0,      // Paluuenergia	
      friction: 0,           // Ei kitkaa
      frictionAir: 0,        // Ei ilmanvastusta
      inertia: Infinity,     // Ei kiertymismuutoksia
      collisionFilter: { group: -1 }, // Ei törmää self-groupiin
    }
  );

  // Maila
  // Asetetaan mediaanikohta y=600
  const paddle = Matter.Bodies.rectangle(
    200 * scaleFactor,
    600 * scaleFactor,
    100 * scaleFactor,
    20 * scaleFactor,
    {
      isStatic: true,
      collisionFilter: { category: 0x0002, mask: 0x0004 }, // Suodatin: vain pallon ryhmä
    }
  );

  // Rajaseinät
  // Vasen ja oikea seinämä x=0 ja x=SCREEN_WIDTH
  const wallLeft = Matter.Bodies.rectangle(
    0,
    300 * scaleFactor,
    20 * scaleFactor,
    600 * scaleFactor,
    { isStatic: true }
  );
  const wallRight = Matter.Bodies.rectangle(
    SCREEN_WIDTH,
    300 * scaleFactor,
    20 * scaleFactor,
    600 * scaleFactor,
    { isStatic: true }
  );
  // Katto y=0, leveydeltään koko ruutu
  const ceiling = Matter.Bodies.rectangle(
    SCREEN_WIDTH / 2,
    0,
    SCREEN_WIDTH,
    20 * scaleFactor,
    { isStatic: true }
  );

  // Tiilien generointi
  const bricks = [];
  const brickCols = 6;
  const brickRows = 7;
  const brickWidth = 58 * scaleFactor;
  const brickHeight = 30 * scaleFactor;
  const spacingX = 5 * scaleFactor;
  const spacingY = 5 * scaleFactor;

  // Keskitetään tiilirakenne horisontaalisesti
  const totalBrickWidth = brickCols * brickWidth + (brickCols - 1) * spacingX;
  const startX = (SCREEN_WIDTH - totalBrickWidth) / 2;
  const totalBricks = brickCols * brickRows;

  // Luo satunnaiset erikoistiilit: kahdenlaisia, "white" ja "double"
  const doubleCount = Math.floor(Math.random() * 7) + 2; // 2..8 kpl
  const whiteCount = Math.floor(Math.random() * 1) + 3;   // aina 3 kpl

  const whiteSpecialIndices = getRandomIndices(whiteCount, totalBricks);
  const doubleSpecialIndices = getRandomIndices(
    doubleCount,
    totalBricks,
    whiteSpecialIndices
  );

  // Käydään sarakkeet i ja rivit j läpi
  for (let i = 0; i < brickCols; i++) {
    for (let j = 0; j < brickRows; j++) {
      // Lasketaan keskipisteen koordinaatit
      const x = startX + i * (brickWidth + spacingX) + brickWidth / 2;
      const y = 100 * scaleFactor + j * (brickHeight + spacingY);
      const index = i * brickRows + j;

      // Asetetaan tyyppi ja osumamäärä
      let brickType = 'normal';
      let hits = 1;
      if (whiteSpecialIndices.has(index)) {
        brickType = 'white';
      } else if (doubleSpecialIndices.has(index)) {
        brickType = 'double';
        hits = 2;
      }

      // Luodaan Matter-keho ja lisätään listaobjektiin
      const brick = Matter.Bodies.rectangle(x, y, brickWidth, brickHeight, {
        label: `brick_${i}_${j}`,
        isStatic: true,
        collisionFilter: { category: 0x0008, mask: 0x0004 }, // Pallon törmäys
      });
      bricks.push({ body: brick, hits, brickType });
    }
  }

  // Lisätään fysiikkamaailmaan kaikki osat
  Matter.World.add(
    world,
    [wallLeft, wallRight, ceiling, ball, paddle, ...bricks.map(b => b.body)]
  );

  // Palautetaan pelin tila, josta pääkomponentti rakentaa entiteetit
  return {
    engine,
    world,
    ball,
    paddle,
    bricks,
    level,
    wallLeft,
    wallRight,
    ceiling,
  };
};

// Pääkomponentti BrickBreaker
// Vastaa pelin tilanhallinnasta, UI:n päivityksistä ja tapahtumien käsittelystä
export default function BrickBreaker() {
  const navigation = useNavigation();      // Siirtyminen muihin näkymiin
  const { nickname } = useNickname();      // Pelaajan lempinimi

  const gameEngine = useRef(null);        // React Native Game Engine -ref

  // Stopataan engine, kun komponentti ei ole focused
  useFocusEffect(
    useCallback(() => {
      return () => {
        if (gameEngine.current) gameEngine.current.stop();
      };
    }, [])
  );

  // Alustetaan pelin tila
  const initialState = setupWorld();      // Kutsu setupWorld tasolla 1
  const [gameState, setGameState] = useState(initialState);
  const [score, setScore]         = useState(0);
  const [gameOver, setGameOver]   = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [levelCleared, setLevelCleared] = useState(false);

  // PanResponder: käsittelee liikuttamisen kosketuksella
  const panResponder = useMemo(
    () => PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gesture) => {
        // Asetetaan pyyhkäisyn x-arvon mailan keskikohdaksi
        const minX = 50 * scaleFactor;
        const maxX = SCREEN_WIDTH - 50 * scaleFactor;
        const newX = Math.min(Math.max(gesture.moveX, minX), maxX);
        if (gameState.paddle) {
          Matter.Body.setPosition(gameState.paddle, { x: newX, y: 600*scaleFactor });
        }
      },
    }),
    [gameState.paddle]
  );

  // Tallentaa pelituloksen Firestoreen
  const storeResult = async () => {
    try {
      await addDoc(collection(db, 'BreakerResults'), {
        Nickname: nickname,
        level:    gameState.level,
        score,
      });
    } catch (err) {
      console.error('Tuloksen tallennus epäonnistui:', err);
    }
  };

  // Siirtyy seuraavalle tasolle
  const nextLevel = () => {
    const newLevel = gameState.level + 1;
    const newGameState = setupWorld(newLevel);
    setGameState(newGameState);
    setGameOver(false);
    setGameStarted(false);
    setLevelCleared(false);

    // Swapataan entiteetit lyhyellä viiveellä,
    // ettei swapata ennen uuden maailman luontia
    setTimeout(() => {
      gameEngine.current.swap({
        physics: { engine: newGameState.engine, world: newGameState.world },
        ball:    { body: newGameState.ball, renderer: Ball, themeIndex: newLevel-1 },
        paddle:  { body: newGameState.paddle, renderer: Paddle },
        wallLeft:  { body: newGameState.wallLeft },
        wallRight: { body: newGameState.wallRight },
        ceiling:   { body: newGameState.ceiling },
        // Lisätään tiilet entiteetteihin dynaamisesti
        ...newGameState.bricks.reduce((acc, brick, idx) => {
          acc[`brick_${idx}`] = {
            body: brick.body,
            renderer: Brick,
            hits: brick.hits,
            brickType: brick.brickType,
            damaged: false,
          };
          return acc;
        }, {}),
      });
    }, 50);
  };

  // Pelin päättymiskäsittelijä
  const gameOverHandler = () => {
    setGameOver(true);
    setGameStarted(false);
    setLevelCleared(false);
    gameEngine.current.stop();
    storeResult(); // Tallennus Firestoreen
  };

  return (
    <View style={BreakerStyles.container} {...panResponder.panHandlers}>
      {/* Näytetään pisteet ja taso näytön ylälaidassa */}
      <Text style={BreakerStyles.score}>
        Points: {score}  Level: {gameState.level}
      </Text>

      {/* Overlay-tila: Game Over */}
      {gameOver && (
        <View style={BreakerStyles.overlay}>
          <Text style={BreakerStyles.overlayText}>Game Over!</Text>
          {/* Uudelleenaloitus */}
          <TouchableOpacity style={BreakerStyles.button} onPress={() => {
            const initial = setupWorld(1);
            setGameState(initial); setScore(0); setGameOver(false);
            setGameStarted(false); setLevelCleared(false);
            setTimeout(() => {
              gameEngine.current.swap({
                physics:{ engine:initial.engine, world:initial.world },
                ball: { body: initial.ball, renderer: Ball },
                paddle: { body: initial.paddle, renderer: Paddle },
                wallLeft: { body: initial.wallLeft },
                wallRight:{ body: initial.wallRight },
                ceiling:{ body: initial.ceiling },
                ...initial.bricks.reduce((a,b,i)=>{
                  a[`brick_${i}`]={ body:b.body, renderer:Brick, hits:b.hits, brickType:b.brickType, damaged:false}; return a;
                },{}),
              });
            },50);
          }}>
            <Text style={BreakerStyles.buttonText}>Play Again</Text>
          </TouchableOpacity>
          {/* Tulossivulle navigointi */}
          <TouchableOpacity style={BreakerStyles.button} onPress={() => navigation.navigate('BreakerResults', { Nickname:nickname, level:gameState.level, score })}>
            <Text style={BreakerStyles.buttonText}>Results</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Overlay-tila: Level Cleared */}
      {levelCleared && (
        <View style={BreakerStyles.overlay}>
          <Text style={BreakerStyles.overlayText}>Level Cleared!</Text>
          <TouchableOpacity style={BreakerStyles.button} onPress={nextLevel}>
            <Text style={BreakerStyles.buttonText}>Next Level</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Overlay-tila: Press to Start ennen pelin alkua */}
      {!gameOver && !levelCleared && !gameStarted && (
        <TouchableOpacity
          style={BreakerStyles.overlay}
          activeOpacity={0.8}
          onPress={() => {
            setGameStarted(true);
            const speed = 4 * scaleFactor + gameState.level;
            Matter.Body.setVelocity(gameState.ball, { x: 0, y: speed });
          }}
        >
          <Text style={BreakerStyles.overlayText}>Press to Start</Text>
        </TouchableOpacity>
      )}

      {/* React Native Game Engine */}
      <GameEngine
        ref={gameEngine}
        style={BreakerStyles.gameContainer}
        systems={[Physics]}             // Fysiikkajärjestelmä
        running={gameStarted}           // Käynnistyslohko
        entities={{
          physics:{ engine:gameState.engine, world:gameState.world },
          ball:{ body:gameState.ball, renderer:Ball, themeIndex:gameState.level },
          paddle:{ body:gameState.paddle, renderer:Paddle },
          wallLeft:{ body:gameState.wallLeft },
          wallRight:{ body:gameState.wallRight },
          ceiling:{ body:gameState.ceiling },
          ...gameState.bricks.reduce((acc, b, i) => {
            acc[`brick_${i}`] = { body:b.body, renderer:Brick, hits:b.hits, brickType:b.brickType, damaged:false };
            return acc;
          }, {}),
        }}
        onEvent={e => {
          if (e.type === 'increase-score') setScore(prev => prev +1);
          if (e.type === 'game-over') gameOverHandler();
          if (e.type === 'level-cleared') { setLevelCleared(true); setGameStarted(false); }
        }}
      />
    </View>
  );
}