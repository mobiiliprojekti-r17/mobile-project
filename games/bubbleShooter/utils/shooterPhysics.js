import Matter from 'matter-js';

const BALL_RADIUS = 20;

export const getRandomPastelColor = () => {
const pastelColors = [
  '#F8BBD0', // vaaleanpunainen (pastelli pinkki)
  '#e4bdff', // vaalea violetti / laventeli
  '#B2EBF2', // vaaleansininen / syaaninen
  '#C8E6C9', // vaaleanvihreä / mintunvihreä
  '#FFF9C4'  // vaaleankeltainen / kerma
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
  const ceiling = Matter.Bodies.rectangle(screenWidth / 2, 0, screenWidth, 50, wallOptions);

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
  const staticBallRadius = 20;
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
      staticBall.id = Matter.Common.nextId(); // 🛠 uniikki ID
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
