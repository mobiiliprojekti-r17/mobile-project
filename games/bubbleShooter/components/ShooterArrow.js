import React, { useMemo } from 'react';
import Svg, { Line } from 'react-native-svg';
import { snapToGrid } from '../utils/shooterPhysics';
import shooterStyles from '../styles/shooterStyles';

const ShooterArrow = ({
  shooterPosition,
  touchStart,
  touchCurrent,
  staticBalls,
  width,
  numCols,
  ballRadius
}) => {
  if (!touchStart || !touchCurrent || !shooterPosition) return null;

  const STEP = 4;
  const MAX_STEPS = 500;
  const MAX_BOUNCES = 2;
  const shortenBy = ballRadius;

  // Start simulation from bottom center of the shooter ball, matching velocity origin
  const posX = shooterPosition.x;
  const posY = shooterPosition.y + ballRadius;

  // Compute initial direction based on same origin point
  const dx = touchCurrent.x - posX;
  const dy = touchCurrent.y - posY;
  const dirLength = Math.hypot(dx, dy);
  if (dirLength === 0) return null;

  const dirX = dx / dirLength;
  const dirY = dy / dirLength;

  // Memoize segment calculation for performance
  const segments = useMemo(() => {
    let x = posX;
    let y = posY;
    let simDirX = dirX;
    let simDirY = dirY;
    let bounces = 0;
    let hitPoint = null;
    const segs = [];

    for (let i = 0; i < MAX_STEPS; i++) {
      const nextX = x + simDirX * STEP;
      const nextY = y + simDirY * STEP;

      // Stop simulation if arrow goes above top edge
      if (nextY < ballRadius) break;

      // Check collision with static balls
      let collided = false;
      for (let ball of staticBalls) {
        const dist = Math.hypot(nextX - ball.position.x, nextY - ball.position.y);
        if (dist <= ballRadius * 2) {
          hitPoint = { x: nextX, y: nextY };
          collided = true;
          break;
        }
      }
      if (collided) break;

      // Wall bounce logic with division-by-zero guard
      if (
        simDirX !== 0 &&
        (nextX <= ballRadius || nextX >= width - ballRadius) &&
        bounces < MAX_BOUNCES
      ) {
        const wallX = nextX <= ballRadius ? ballRadius : width - ballRadius;
        const t = (wallX - x) / simDirX; // safe because simDirX !== 0
        const wallY = y + simDirY * t;
        segs.push({ x1: x, y1: y, x2: wallX, y2: wallY });
        x = wallX;
        y = wallY;
        simDirX = -simDirX;
        bounces++;
        continue;
      }

      // Regular trajectory segment
      segs.push({ x1: x, y1: y, x2: nextX, y2: nextY });
      x = nextX;
      y = nextY;
    }

    // Final snap-to-grid segment if collision detected
    if (hitPoint) {
      const tempBody = { position: hitPoint };
      const snap = snapToGrid(tempBody, width, numCols);
      const toSnapX = snap.x - x;
      const toSnapY = snap.y - y;
      const toSnapLen = Math.hypot(toSnapX, toSnapY);
      const ratio = Math.max(0, (toSnapLen - shortenBy) / toSnapLen);
      const finalX = x + toSnapX * ratio;
      const finalY = y + toSnapY * ratio;
      segs.push({ x1: x, y1: y, x2: finalX, y2: finalY });
    }

    return segs;
  }, [posX, posY, dirX, dirY, staticBalls, width, numCols, ballRadius]);

  const arrowStyle = {
    stroke: '#FF70C0',
    strokeWidth: 4,
    strokeLinecap: 'round',
    strokeDasharray: '6, 4',
  };

  const shadowStyle = {
    stroke: 'rgba(0,0,0,0.1)',
    strokeWidth: 6,
    strokeLinecap: 'round',
  };

  return (
    <Svg style={shooterStyles.arrowLine}>
      {segments.map((seg, i) => (
        <React.Fragment key={`seg-${i}`}>
          <Line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} {...shadowStyle} />
          <Line x1={seg.x1} y1={seg.y1} x2={seg.x2} y2={seg.y2} {...arrowStyle} />
        </React.Fragment>
      ))}
    </Svg>
  );
};

export default ShooterArrow;
