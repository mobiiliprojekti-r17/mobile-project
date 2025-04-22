import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Audio } from 'expo-av';
import { View, Dimensions, Text, TouchableOpacity, Image } from 'react-native';
import Matter from 'matter-js';
import {
  createPhysics,
  createShooterBall,
  createStaticBalls,
  updatePhysics,
  getRandomPastelColor,
  findClusterAndRemove,
  findFloatingBalls,
  getAvailableColors,
  snapToGrid,
  getGridRow,
  addRowsToGrid
} from '../utils/shooterPhysics';
import Ball from './ShooterBall';
import AnimatedBall from './ShooterBallAnimation';
import ScorePopUp from './ScorePop';
import { useRoute } from "@react-navigation/native";
import { db } from "../../../firebase/Config";
import { collection, addDoc } from "firebase/firestore";
import shooterStyles from '../styles/shooterStyles';
import { useNickname } from '../../../context/context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import ShooterArrow from './ShooterArrow';

const { width, height } = Dimensions.get('window'); //Näytön leveys ja korkeus
const BALL_RADIUS = 20; //Ampumispallon säde
const SHOOTER_BALL_Y = height - 200; //Alkuperäinen y- koordinaatti 
const topOffset = 80; //Yläreunan haamuehti, johon pallot on kytketty
const numCols = 9; //Kentän sarakkeiden määrä

//BubbleShooter- komponentti, joka hoitaa pelin logiikan sekä renderöinnin

const BubbleShooter = ({ navigation }) => {
  const soundRef = useRef(null); //Ääniefekti
  const lastPopSoundTime = useRef(0); //Viimeisin aikaan perustuva äänentoisto
  const shooterBall = useRef(null); //Ampumispallo
  const staticBallsRef = useRef([]); //Staattiset pollot
  const scoreRef = useRef(0); //Pistelaskuri
  const shotCounterRef = useRef(0); //Ampumislaskuri
  const gameOverTriggered = useRef(false); //Pelin päättyminen
  const rafIdRef = useRef(null); // requestAnimationFrame-kutsun ref
  const aggregatedTimeoutRef = useRef(null); //Popupin timeout ref

  const lastPosUpdate = useRef(0);

  const engineRef = useRef(null); //Tallentaa fysiikka engine instanssin
  const worldRef = useRef(null); //Tallentaa fysiikkamaailman viitteen
  const ceilingRef = useRef(null); //Tallentaa katon

  //Pallon sijainnin sekä staattisten pallojen tila
  const [ballPosition, setBallPosition] = useState({ x: width / 2, y: SHOOTER_BALL_Y }); //Pallon on-screen sijainti sekä staattisten pallojen lista
  const [staticBalls, setStaticBalls] = useState([]);
  const [ballsInitialized, setBallsInitialized] = useState(false); //Onko pallot valmiiksi luotu?
  const [isBallAtCenter, setIsBallAtCenter] = useState(true); //Onko pallo lähtöasennossa?
  const [gameOver, setGameOver] = useState(false); //Onko peli päättynyt?
  const [score, setScore] = useState(0); //Näytettävät pisteet
  const [poppedBalls, setPoppedBalls] = useState([]); //Animaatiota varten kerätyt poistettavat pallot
  const [aggregatedPopup, setAggregatedPopup] = useState(null); //Yhteenlaskettu piste- popup

  //Parametrit nuolen piirtoa varten
  const [aimAngle, setAimAngle] = useState(0);
  const [isAiming, setIsAiming] = useState(false);
  const [touchPosition, setTouchPosition] = useState(null);
  //Kosketuksen pohjalta lasketaan suuntakulma nuolen piirtoon
  const [touchStart, setTouchStart] = useState(null);
  const [touchCurrent, setTouchCurrent] = useState(null);
  const [canShoot, setCanShoot] = useState(true);// estetään peräkkäiset laukaukset

  const route = useRoute(); //Reititys
  const { nickname } = useNickname(); //Firebasen käyttäjänimi kontekstista

  //Äänen lataus sekä unload komponentin elinkaaren aikana
  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(require('../assets/bubbleSound.mp3'));
        soundRef.current = sound;
      } catch (error) {
        console.error('Error loading sound:', error);
      }
    };
    loadSound();
    //Puretaan ääni, kun komponentti unmounttaa
    return () => {
      if (soundRef.current) soundRef.current.unloadAsync();
    };
  }, []);

  //Toistetaan poksahdusääni enintään kerran 100ms välein
  const playPopSound = async () => {
    const now = Date.now();
    if (now - lastPopSoundTime.current < 100) return;
    lastPopSoundTime.current = now;
    try {
      if (soundRef.current) {
        await soundRef.current.replayAsync();
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  //Yhdistetään useat popupit ja näytetään ne
  const addAggregatedPopup = (points, x, y) => {
    setAggregatedPopup(prev => {
      if (prev) {
        //Lasketaan uusi pisteyhteenveto ja keskiarvo
        const newPoints = prev.points + points;
        const avgX = (prev.x * prev.points + x * points) / newPoints;
        const avgY = (prev.y * prev.points + y * points) / newPoints;
        return { ...prev, points: newPoints, x: avgX, y: avgY };
      }
      //Luodaan uusi popup- objekti
      return { id: `${Date.now()}-${Math.random()}`, points, x, y };
    });
    //Asetetaan timeout popupin automaatiselle katoamiselle
    if (aggregatedTimeoutRef.current) clearTimeout(aggregatedTimeoutRef.current);
    aggregatedTimeoutRef.current = setTimeout(() => setAggregatedPopup(null), 1000);
  };
  
  //Päivitetään staticBallsRef aina, kun staticBalls muuttuu
  useEffect(() => {
    staticBallsRef.current = staticBalls;
  }, [staticBalls]);

  //Alustetaan dynaaminen pallo staattiseksi värin kanssa
  const initShooterBall = () => {
    const availableColors = getAvailableColors(staticBallsRef.current);
    const color = availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : getRandomPastelColor();
    //Luodaan pallo ja laitetaan se maailmaan
    shooterBall.current = createShooterBall(worldRef.current, width / 2, SHOOTER_BALL_Y, BALL_RADIUS, color);
    Matter.Body.setStatic(shooterBall.current, true);
    //Päivitetään näkymän state pallon sijainnilla
    setBallPosition({ x: shooterBall.current.position.x, y: shooterBall.current.position.y });
  };

  //Nollataan dynaaminen pallo lähtöasentoon ja asetetaan uusi väri
  const resetShooterBall = () => {
    const availableColors = getAvailableColors(staticBallsRef.current);
    const color = availableColors.length > 0
      ? availableColors[Math.floor(Math.random() * availableColors.length)]
      : getRandomPastelColor();
    //Luodaan uusi pallo ja asetetaan se staattiseksi
    const newBall = createShooterBall(worldRef.current, width / 2, SHOOTER_BALL_Y, BALL_RADIUS, color);
    Matter.Body.setStatic(newBall, true);
    shooterBall.current = newBall;
    setBallPosition({ x: newBall.position.x, y: newBall.position.y });
    setIsBallAtCenter(true); //Onko pallo keskellä?
    setCanShoot(true); //Sallitaan uusi laukaus
  };

  //Lisätään ruudukkoon rivejä 
  const addRows = (numRows = 1) => {
    setStaticBalls(prevBalls => {
      return addRowsToGrid({
        staticBalls: prevBalls,
        numRows,
        world: worldRef.current,
        numCols,
        width,
      });
    });
  };

  //Kosketuksen käsittelijä kun palloa ammutaan
  const handleTouch = useCallback((event) => {
    // Jos peli päättynyt tai laukaisu ei ole sallittu, keskeytetään
    if (
      gameOver ||
      !canShoot || // << uusi ehto
      !shooterBall.current ||
      !shooterBall.current.isStatic
    ) {
      return;
    }
    setCanShoot(false); // estetään uudet laukaukset ennen resettiä
    const touchX = event.nativeEvent.pageX;
    const touchY = event.nativeEvent.pageY;
    const directionX = touchX - shooterBall.current.position.x;
    const directionY = touchY - (shooterBall.current.position.y + BALL_RADIUS);
    const angle = Math.atan2(directionY, directionX); //Lasketaan suuntakulma
    setAimAngle(angle);
  
    const speed = 15;
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };
   //Asetetaan nopeus ja vapautetaan pallo liikkeeseen 
    Matter.Body.setStatic(shooterBall.current, false);
    Matter.Body.set(shooterBall.current, {
      restitution: 1,
      friction: 0,
      frictionAir: 0,
    });
    Matter.Body.setVelocity(shooterBall.current, velocity);
    setIsBallAtCenter(false);
  }, [canShoot, gameOver]);
  
  //Tallennetaan lopullinen pistemäärä Firebaseen ja navigoidaan GameOver Screeniin
  const storeShooterResults = async () => {
    try {
      await addDoc(collection(db, "ShooterResults"), {
        Nickname: nickname,
        score: scoreRef.current,
      });
    } catch (error) {
      console.error("Error storing result: ", error);
    }
    navigation.replace("ShooterGameOver", {
      nickname,
      finalScore: scoreRef.current,
    });
  };

  //Alustusefekti-> luodaan fysiikka, pallot, törmäys ja peli- loop
  useEffect(() => {
    //Alustetaan fysiikka ja tallennetaan refit
    const { engine, world, ceiling } = createPhysics(width, height);
    engineRef.current = engine;
    worldRef.current = world;
    ceilingRef.current = ceiling;
    //Luodaan aloittavat pallot
    initShooterBall();
    const initialStaticBalls = createStaticBalls(world, 9, numCols, width);
    setStaticBalls(initialStaticBalls);
    setBallsInitialized(true);

    //Törmäyksen käsittely
    const collisionHandler = (event) => {
      for (let { bodyA, bodyB } of event.pairs) {
         // Jos ampumispalloa ei ole olemassa (jo poistettu), lopetetaan käsittely
        if (!shooterBall.current) break;
        const shooter = shooterBall.current;
         // Määritellään, kumpi törmäyksen kehoista ei ole ampumispallo
        let other = bodyA === shooter ? bodyB : bodyB === shooter ? bodyA : null;
        // Jos törmäysparina löytyy ampumispallon vastapuoli trkistetaan, osuuko ampumispallo staattiseen palloon
        if (other) {
          const isStaticBall = staticBallsRef.current.some((b) => b.id === other.id);
          // Tarkistetaan osuuko pallo kattoon
          if (isStaticBall || bodyB === ceiling || bodyA === ceiling) {
            Matter.Body.setVelocity(shooter, { x: 0, y: 0 });
            Matter.Body.setStatic(shooter, true);
            //Snapataan pallo ruudukkoon, haetaan lähin ruudun koordinaatti ja lsketaan ruudukon rivi ja sarake
            const snappedCoords = snapToGrid(shooter, width, numCols);
            Matter.Body.setPosition(shooter, snappedCoords);
            const row = getGridRow(snappedCoords.y);
            let baseOffset = (width - (numCols * BALL_RADIUS * 2)) / 2;
            if (row % 2 !== 0) baseOffset += BALL_RADIUS;
            const col = Math.round((snappedCoords.x - baseOffset) / (BALL_RADIUS * 2));
            shooter.gridRow = row;
            shooter.gridCol = col;
            //Etsitään ja poistetaan vähintään kolmen saman värisen pallon klusteri
            const cluster = findClusterAndRemove(staticBallsRef.current, shooter);
            if (cluster.length > 0) {
              const totalPoints = cluster.length * 10;
              const avgX = cluster.reduce((sum, b) => sum + b.position.x, 0) / cluster.length;
              const avgY = cluster.reduce((sum, b) => sum + b.position.y, 0) / cluster.length;
              addAggregatedPopup(totalPoints, avgX, avgY);
              // Poistetaan klusterin pallot maailmasta ja näytöltä
              cluster.forEach(ball => {
                playPopSound();
                setPoppedBalls(prev => [...prev, { id: ball.id, x: ball.position.x, y: ball.position.y, color: ball.color }]);
                Matter.World.remove(world, ball);
              });
              //äivitetään staattisten pallojen lista ja pistemäärä
              setStaticBalls(prev => prev.filter(ball => !cluster.includes(ball)));
              setScore(prev => {
                const newScore = prev + totalPoints;
                scoreRef.current = newScore;
                return newScore;
              });
            } else {
              //Josa klusteria ei löytynyt, lisätään ampumispallo staattisiin palloihin
              shotCounterRef.current += 1;
              setStaticBalls(prev => [...prev, shooter]);
              //Jos viisi peräkkäistä palloa ei poista yhtään klusteria, lisätään uusi rivi ylhäältä
              if (shotCounterRef.current >= 5) {
                shotCounterRef.current = 0;
                const availableColors = getAvailableColors(staticBallsRef.current);
                const rowsToAdd = availableColors.length === 2 ? 4 : 1;
                addRows(rowsToAdd);
              }
            }
            //Tarkistetaan "kelluvat" pallot jotka ei ole yhteydessä yläreunaan
            const updatedBalls = staticBallsRef.current.filter(ball => !cluster.includes(ball));
            const floatingBalls = findFloatingBalls(updatedBalls);
            if (floatingBalls.length > 0) {
              floatingBalls.forEach(ball => {
                playPopSound();
                addAggregatedPopup(15, ball.position.x, ball.position.y);
                setPoppedBalls(prev => [...prev, { id: ball.id, x: ball.position.x, y: ball.position.y, color: ball.color }]);
                Matter.World.remove(world, ball);
              });
              setStaticBalls(prev => prev.filter(ball => !floatingBalls.includes(ball)));
              setScore(prev => {
                const newScore = prev + floatingBalls.length * 15;
                scoreRef.current = newScore;
                return newScore;
              });
            }
            //Nollataan ampumispallo ja valmistaudutaan uuteen laukaukseen
            shooterBall.current = null;
            resetShooterBall();
            break;
          }
        }
      }
    };
    // Liitetään törmäyksen käsittelijä fysiikkamoottorin collisionStart-tapahtumaan
    Matter.Events.on(engine, 'collisionStart', collisionHandler);
    //Päivitetään fysiikka
    const update = () => {
      updatePhysics(engine);
      //Jos dynaaminen pallo on olemassa, päivitetään sen näyttösijainti
      if (shooterBall.current) {
        const { x, y } = shooterBall.current.position;
        setBallPosition({ x, y });
      }
      //Tarksitetaan onko mikään staattisista palloista liian alhaalla, jos on niin peli loppuu
      if (!gameOverTriggered.current) {
        for (let ball of staticBallsRef.current) {
          if (ball.position.y + BALL_RADIUS >= height - 220) {
            gameOverTriggered.current = true;
            setGameOver(true);
            storeShooterResults();
            break;
          }
        }
      }
      //Ajetaan päivitys render-loopilla
      rafIdRef.current = requestAnimationFrame(update);
    };
    //Ennen pelisilmukan käynnistystä varmistetaan, että aijempi kutsu on peruttu
    if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    //Käynnistetään pelisilmukka
    update();
    //Cleanup- funktio
    return () => {
      // Lopetetaan pyörivä requestAnimationFrame kutsu
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      Matter.Events.off(engine, 'collisionStart', collisionHandler);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
       // Nollataan ref‑muuttujat 
      shooterBall.current = null;
      staticBallsRef.current = [];
      rafIdRef.current = null;
      gameOverTriggered.current = false;
    };
  }, []);

  //Tarkistetaan pelikentän tyhjeneminen -> peli loppuu
  useEffect(() => {
    if (ballsInitialized && staticBalls.length === 0 && !gameOverTriggered.current) {
      gameOverTriggered.current = true;
      setGameOver(true);
      storeShooterResults();
    }
  }, [staticBalls, ballsInitialized]);

  return (
    <View
      style={{ flex: 1, position: 'relative' }} 
      onStartShouldSetResponder={() => canShoot}
      onResponderGrant={(e) => {
        const { pageX, pageY } = e.nativeEvent;
        setTouchStart({ x: pageX, y: pageY });
        setTouchCurrent({ x: pageX, y: pageY });
      }}
      onResponderMove={(e) => {
        const { pageX, pageY } = e.nativeEvent;
        setTouchCurrent({ x: pageX, y: pageY });
      }}
      onResponderRelease={(e) => {
        const { pageX, pageY } = e.nativeEvent;
        handleTouch({ nativeEvent: { pageX, pageY } });
        setTouchStart(null);
        setTouchCurrent(null);
      }}
    >
      <LinearGradient colors={['rgb(255, 158, 226)', '#fac3e9']} style={shooterStyles.shooterGameContainer}>
  
        {/* Yläpalkki */}
        <View style={shooterStyles.homeBox}>
          <TouchableOpacity onPress={() => navigation.replace('Home')}>
            <Ionicons name="home" style={shooterStyles.shooterHomeIcon} />
          </TouchableOpacity>
        </View>
        {/*Pisteet*/}
        <View style={shooterStyles.scoreBox}>
          <Text style={shooterStyles.shooterScoreText}>Score: {score}</Text>
        </View>
        {/* Nuoli*/}
          {shooterBall.current && isBallAtCenter && (
          <ShooterArrow
            shooterPosition={shooterBall.current.position}
            touchStart={touchStart}
            touchCurrent={touchCurrent}
            staticBalls={staticBallsRef.current}
            width={width}
            numCols={numCols}
            ballRadius={BALL_RADIUS}
          />
        )}
        {/* Staattiset pallot */}
        {staticBalls.map(ball => (
          <Ball key={ball.id} x={ball.position.x} y={ball.position.y} size={40} color={ball.color} />
        ))}
        {/* Ampumispallo */}
        {shooterBall.current && (
          <Ball
            x={ballPosition.x}
            y={ballPosition.y}
            size={40}
            color={shooterBall.current?.color || 'blue'}
          />
        )}
        {/* Animaatiopallot */}
        {poppedBalls.map(pop => (
          <AnimatedBall
            key={pop.id}
            x={pop.x}
            y={pop.y}
            size={40}
            color={pop.color}
            onAnimationEnd={() => {
              setPoppedBalls(prev => prev.filter(item => item.id !== pop.id));
            }}
          />
        ))}
        {/* Score popup */}
        {aggregatedPopup && (
          <ScorePopUp
            key={aggregatedPopup.id}
            score={aggregatedPopup.points}
            x={aggregatedPopup.x}
            y={aggregatedPopup.y}
            onAnimationEnd={() => setAggregatedPopup(null)}
          />
        )}
        {/* Taustakuva */}
        <Image
          source={require('../assets/image.png')}
          style={{ position: 'absolute', bottom: -90, right: -100, width: 300, height: 300 }}
          resizeMode="contain"
        />
      </LinearGradient>
    </View>
  );  
  
};

export default BubbleShooter;
