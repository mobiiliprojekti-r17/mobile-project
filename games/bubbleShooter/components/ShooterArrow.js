import React from 'react';
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
  const shortenBy = 20;

  let posX = shooterPosition.x;
  let posY = shooterPosition.y + ballRadius;

  const dx = touchCurrent.x - posX;
  const dy = touchCurrent.y - posY;
  const dirLength = Math.sqrt(dx * dx + dy * dy);
  if (dirLength === 0) return null;

  let dirX = dx / dirLength;
  let dirY = dy / dirLength;

  const segments = [];
  let bounces = 0;
  let hitPoint = null;

  for (let i = 0; i < MAX_STEPS; i++) {
    const nextX = posX + dirX * STEP;
    const nextY = posY + dirY * STEP;

    for (let ball of staticBalls) {
      const dist = Math.hypot(nextX - ball.position.x, nextY - ball.position.y);
      if (dist <= ballRadius * 2 - 1) {
        hitPoint = { x: nextX, y: nextY };
        break;
      }
    }

    if (hitPoint) break;

    if ((nextX <= ballRadius || nextX >= width - ballRadius) && bounces < MAX_BOUNCES) {
      const wallX = nextX <= ballRadius ? ballRadius : width - ballRadius;
      const t = (wallX - posX) / dirX;
      const wallY = posY + dirY * t;

      segments.push({ x1: posX, y1: posY, x2: wallX, y2: wallY });

      posX = wallX;
      posY = wallY;
      dirX = -dirX;
      bounces++;
      continue;
    }

    segments.push({ x1: posX, y1: posY, x2: nextX, y2: nextY });

    posX = nextX;
    posY = nextY;
  }

  if (hitPoint) {
    const tempBody = { position: hitPoint };
    const snap = snapToGrid(tempBody, width, numCols);

    const toSnapX = snap.x - posX;
    const toSnapY = snap.y - posY;
    const toSnapLength = Math.hypot(toSnapX, toSnapY);
    const shortenRatio = Math.max(0, (toSnapLength - shortenBy) / toSnapLength);
    const shortenedX = posX + toSnapX * shortenRatio;
    const shortenedY = posY + toSnapY * shortenRatio;

    segments.push({
      x1: posX,
      y1: posY,
      x2: shortenedX,
      y2: shortenedY,
    });
  }

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
