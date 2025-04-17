
import Matter from 'matter-js';

const BALL_RADIUS = 20;

export const getRandomPastelColor = () => {
  const pastelColors = [
    '#ffc7fd',
    '#d3b5ff',
    '#a0dcff',
    '#c2ff9a',
    '#fff68f'
  ];
  return pastelColors[Math.floor(Math.random() * pastelColors.length)];
};

export const createPhysics = (screenWidth, screenHeight) => {
  const engine = Matter.Engine.create();
  const world = engine.world;
  engine.world.gravity.x = 0;
  engine.world.gravity.y = 0;

  const wallOptions = { isStatic: true, restitution: 1 };
  const ground = Matter.Bodies.rectangle(screenWidth / 2, screenHeight - 80, screenWidth, 50, wallOptions);
  const leftWall = Matter.Bodies.rectangle(0, screenHeight / 2, 50, screenHeight, wallOptions);
  const rightWall = Matter.Bodies.rectangle(screenWidth, screenHeight / 2, 50, screenHeight, wallOptions);
  const ceiling = Matter.Bodies.rectangle(screenWidth / 2, 60, screenWidth, 10, wallOptions);
  Matter.World.add(world, [ground, leftWall, rightWall, ceiling]);

  return { engine, world, ceiling };
};

export const createShooterBall = (world, x, y, radius, color) => {
  const ball = Matter.Bodies.circle(x, y, radius, {
    restitution: 0,
    frictionAir: 0.01,
    density: 0.001,
    inertia: Infinity,
    friction: 0,
    collisionFilter: {
      category: 0x0002,
      mask: 0x0001 | 0x0002,
    },
  });
  ball.color = color;
  ball.id = Matter.Common.nextId();
  Matter.World.add(world, ball);
  return ball;
};

export const createStaticBalls = (world, numRows, numCols, screenWidth) => {
  const staticBallRadius = BALL_RADIUS;
  const staticBallsArray = [];
  const horizontalSpacing = staticBallRadius * 2;
  const verticalSpacing = staticBallRadius * Math.sqrt(3);
  const offsetX = (screenWidth - (numCols * horizontalSpacing)) / 2;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      let xPos = offsetX + col * horizontalSpacing;
      let yPos = 80 + row * verticalSpacing;
      if (row % 2 !== 0) {
        xPos += horizontalSpacing / 2;
      }
      const staticBall = Matter.Bodies.circle(xPos, yPos, staticBallRadius, {
        isStatic: true,
        restitution: 0,
        collisionFilter: {
          category: 0x0001,
          mask: 0x0002,
        },
      });
      staticBall.color = getRandomPastelColor();
      staticBall.id = Matter.Common.nextId();
      Matter.World.add(world, staticBall);
      staticBallsArray.push(staticBall);
    }
  }
  return staticBallsArray;
};

export const updatePhysics = (engine) => {
  Matter.Engine.update(engine);
};

export const findClusterAndRemove = (balls, targetBall) => {
  const queue = [targetBall];
  const visited = new Set();
  const cluster = [];

  while (queue.length > 0) {
    const current = queue.pop();
    if (visited.has(current.id)) continue;
    visited.add(current.id);
    cluster.push(current);

    for (let ball of balls) {
      if (ball.id !== current.id && ball.color === current.color) {
        const dx = ball.position.x - current.position.x;
        const dy = ball.position.y - current.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= 2 * BALL_RADIUS + 2) {
          queue.push(ball);
        }
      }
    }
  }

  return cluster.length >= 3 ? cluster : [];
};

export const findFloatingBalls = (balls) => {
  const connectedToTop = new Set();
  const queue = [];

  for (let ball of balls) {
    if (ball.position.y <= 100) {
      queue.push(ball);
      connectedToTop.add(ball.id);
    }
  }

  while (queue.length > 0) {
    const current = queue.pop();
    for (let ball of balls) {
      if (connectedToTop.has(ball.id)) continue;
      const dx = ball.position.x - current.position.x;
      const dy = ball.position.y - current.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= 2 * BALL_RADIUS + 2) {
        connectedToTop.add(ball.id);
        queue.push(ball);
      }
    }
  }

  return balls.filter(ball => !connectedToTop.has(ball.id));
};

export const getAvailableColors = (balls) => {
  const colorSet = new Set();
  for (let ball of balls) {
    colorSet.add(ball.color);
  }
  return Array.from(colorSet);
};

export const snapToGrid = (body, screenWidth, numCols) => {
  const topOffset = 80;
  const horizontalSpacing = BALL_RADIUS * 2;
  const verticalSpacing = BALL_RADIUS * Math.sqrt(3);
  let offsetX = (screenWidth - (numCols * horizontalSpacing)) / 2;
  const row = Math.round((body.position.y - topOffset) / verticalSpacing);
  if (row % 2 !== 0) {
    offsetX += horizontalSpacing / 2;
  }
  const col = Math.round((body.position.x - offsetX) / horizontalSpacing);
  const snappedX = offsetX + col * horizontalSpacing;
  const snappedY = topOffset + row * verticalSpacing;
  return { x: snappedX, y: snappedY };
};

export const getGridCoordsFromPosition = (x, y, screenWidth, numCols) => {
  const topOffset = 80;
  const horizontalSpacing = BALL_RADIUS * 2;
  const verticalSpacing = BALL_RADIUS * Math.sqrt(3);
  let offsetX = (screenWidth - (numCols * horizontalSpacing)) / 2;
  const row = Math.round((y - topOffset) / verticalSpacing);
  if (row % 2 !== 0) {
    offsetX += horizontalSpacing / 2;
  }
  const col = Math.round((x - offsetX) / horizontalSpacing);
  return { row, col };
};

export const gridToPosition = (row, col, screenWidth, numCols) => {
  const BALL_RADIUS = 20;
  const horizontalSpacing = BALL_RADIUS * 2;
  const verticalSpacing = BALL_RADIUS * Math.sqrt(3);
  let baseOffset = (screenWidth - (numCols * horizontalSpacing)) / 2;
  if (row % 2 !== 0) {
    baseOffset += horizontalSpacing / 2;
  }
  return { x: baseOffset + col * horizontalSpacing, y: 80 + row * verticalSpacing };
};

export const getGridRow = (y) => {
  const BALL_RADIUS = 20;
  const topOffset = 80;
  const verticalSpacing = BALL_RADIUS * Math.sqrt(3);
  return Math.round((y - topOffset) / verticalSpacing);
};

export const addRowsToGrid = ({
  staticBalls,
  numRows = 1,
  world,
  numCols,
  width,
}) => {
  const BALL_RADIUS = 20;
  const topOffset = 80;
  const horizontalSpacing = BALL_RADIUS * 2;
  const verticalSpacing = BALL_RADIUS * Math.sqrt(3);
  let combinedBalls = staticBalls;

  for (let i = 0; i < numRows; i++) {
    combinedBalls = combinedBalls.map(ball => {
      if (typeof ball.gridRow !== 'number' || typeof ball.gridCol !== 'number') {
        const snappedCoords = snapToGrid(ball, width, numCols);
        Matter.Body.setPosition(ball, { x: snappedCoords.x, y: snappedCoords.y });
        const row = Math.round((snappedCoords.y - topOffset) / verticalSpacing);
        let baseOffset = (width - (numCols * horizontalSpacing)) / 2;
        if (row % 2 !== 0) baseOffset += horizontalSpacing / 2;
        const col = Math.round((snappedCoords.x - baseOffset) / horizontalSpacing);
        ball.gridRow = row;
        ball.gridCol = col;
      }
      ball.gridRow += 1;
      const newPos = gridToPosition(ball.gridRow, ball.gridCol, width, numCols);
      Matter.Body.setPosition(ball, newPos);
      return ball;
    });

    const availableColors = getAvailableColors(combinedBalls);

    const newRowBalls = [];
    for (let col = 0; col < numCols; col++) {
      const pos = gridToPosition(0, col, width, numCols);
      const newBall = Matter.Bodies.circle(pos.x, pos.y, BALL_RADIUS, {
        isStatic: true,
        restitution: 0,
        collisionFilter: { category: 0x0001, mask: 0x0002 },
      });
      newBall.color = availableColors.length > 0 
        ? availableColors[Math.floor(Math.random() * availableColors.length)]
        : getRandomPastelColor();
      newBall.id = Matter.Common.nextId();
      newBall.gridRow = 0;
      newBall.gridCol = col;
      Matter.World.add(world, newBall);
      newRowBalls.push(newBall);
    }

    combinedBalls = [...newRowBalls, ...combinedBalls];
    const floating = findFloatingBalls(combinedBalls);
    floating.forEach(ball => Matter.World.remove(world, ball));
    combinedBalls = combinedBalls.filter(ball => !floating.includes(ball));
  }

  return combinedBalls;
};
