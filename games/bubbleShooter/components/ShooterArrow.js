import React, { useMemo } from 'react';
import { View, Dimensions } from 'react-native';
import shooterStyles from '../styles/shooterStyles';
import { snapToGrid } from '../utils/shooterPhysics';
//Haetaan näyön leveys ja korkeus
const { width, height } = Dimensions.get('window');
//Askellusaskel, maksimiaskeleet ennustettuun törmäysviivaan ja pomppujen enimmäismäärä 
const STEP = 4;
const MAX_STEPS = 500;
const MAX_BOUNCES = 2;

//Piirretään visuaalinen nuoli ja lasketaan lyhyet segmentit
export default function ShooterArrow({
  shooterPosition,
  touchStart,
  touchCurrent,
  staticBalls,
  numCols,
  ballRadius,
}) {
  // Jos tarvitut tiedot puuttuvat, ei piirretä nuolta
  if (!touchStart || !touchCurrent || !shooterPosition) return null;
  //Lasketaan nuolen segmentit useMemo- hookilla-> ei turhaan tarvi uudelleen laskea joka renderissä
  const segments = useMemo(() => {
    //Aloituskohta
    let x = shooterPosition.x;
    let y = shooterPosition.y + ballRadius;
    //Suuntaverktori kosketuksen ja aloituspisteen välillä
    const dx = touchCurrent.x - x;
    const dy = touchCurrent.y - y;
    const length = Math.hypot(dx, dy);
    if (length === 0) return [];
    //Suunnan normalisointi
    let vx = dx / length;
    let vy = dy / length;

    let bounces = 0; //Seinäpomppujen laskuri
    const segs = []; //Piirrettyjen segmenttien tallennus
    let hitPoint = null; //Osumispiste palloon

    //Iteroidaan askel askeleelta
    for (let i = 0; i < MAX_STEPS; i++) {
      const nextX = x + vx * STEP;
      const nextY = y + vy * STEP;
      // Jos mennään ruudun yläpuolelle, lopetetaan
      if (nextY < 0) break;

      // Tarkistetaan törmäys staattisiin palloihin 
      let collided = false;
      for (const ball of staticBalls) {
        const dist = Math.hypot(nextX - ball.position.x, nextY - ball.position.y);
        if (dist <= ballRadius * 2) {
          hitPoint = { x: nextX, y: nextY };
          collided = true;
          break;
        }
      }
      if (collided) break;

      // Pomppu seinästä
      if ((nextX <= ballRadius || nextX >= width - ballRadius) && bounces < MAX_BOUNCES) {
        // Lasketaan mahdollisimman tarkka pomppukohta seinällä
        const wallX = nextX <= ballRadius ? ballRadius : width - ballRadius;
        const t = (wallX - x) / vx;
        const wallY = y + vy * t;
        segs.push({ x1: x, y1: y, x2: wallX, y2: wallY });
        x = wallX; y = wallY;
        vx = -vx;
        bounces++;
        continue;
      }
      // Lisätään segmentti ennen pomppua
      segs.push({ x1: x, y1: y, x2: nextX, y2: nextY });
      x = nextX; y = nextY;
    }
    //Jos osuimme palloon, jatketaan ruudukkoon snapattuun pisteeseen asti
    if (hitPoint) {
      const snap = snapToGrid({ position: hitPoint }, width, numCols);
      const tx = snap.x - x;
      const ty = snap.y - y;
      const dist = Math.hypot(tx, ty);
      const ratio = Math.max(0, (dist - ballRadius) / dist);
      segs.push({ x1: x, y1: y, x2: x + tx * ratio, y2: y + ty * ratio });
    }

    return segs;
  }, [shooterPosition, touchStart, touchCurrent, staticBalls, numCols, ballRadius]);

  //
  return (
    <View pointerEvents="none" style={shooterStyles.arrowLine}>
      {segments.map((seg, i) => {
        const dx = seg.x2 - seg.x1;
        const dy = seg.y2 - seg.y1;
        const length = Math.hypot(dx, dy);
        const angle = Math.atan2(dy, dx);
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: seg.x1,
              top: seg.y1,
              width: length,
              height: 0,
              borderColor: '#FF70C0',
              borderWidth: 4,
              borderStyle: 'dashed',
              borderRadius: 2,
              transform: [
                { translateY: -2 },
                { rotate: `${angle}rad` },
              ],
            }}
          />
        );
      })}
    </View>
  );
}
