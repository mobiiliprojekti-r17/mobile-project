import Matter from 'matter-js';
 
export const getRandomPastelColor = () => {
  const r = Math.floor(Math.random() * 127 + 128);
  const g = Math.floor(Math.random() * 127 + 128);
  const b = Math.floor(Math.random() * 127 + 128);
  return `rgb(${r}, ${g}, ${b})`;
};
export const createPhysics = () => {
  const engine = Matter.Engine.create();
  const world = engine.world;
  engine.world.gravity.x = 0;
  engine.world.gravity.y = 0;
 
  return { engine, world };
};
 
export const createShooterBall = (world, x, y, radius, color) => {
  const ball = Matter.Bodies.circle(x, y, radius, {
    restitution: 0.4,
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
  Matter.World.add(world, ball);
  return ball;
};
 
export const createStaticBalls = (world, numRows, numCols, screenWidth) => {
  const staticBallRadius = 20;
  const staticBallsArray = [];
 
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const xPos = (screenWidth / (numCols + 1)) * (col + 1);
      const yPos = 100 + row * (staticBallRadius * 2 + 10);
      const staticBall = Matter.Bodies.circle(xPos, yPos, staticBallRadius, { isStatic: true });
      Matter.World.add(world, staticBall);
      staticBall.color = getRandomPastelColor();
      staticBallsArray.push(staticBall);
    }
  }
 
  return staticBallsArray;
};
 
export const updatePhysics = (engine, shooterBall, staticBalls, resetShooter) => {
  Matter.Engine.update(engine);
 
  if (shooterBall && shooterBall.restitution === 0) {
    shooterBall.restitution = 0.4;
  }
 
  staticBalls.forEach((ball, index) => {
    if (!ball || !shooterBall) return;
 
    let collision = Matter.Collision.collides(shooterBall, ball);
    if (collision && collision.collided) {
      Matter.World.remove(engine.world, ball);
      staticBalls.splice(index, 1);
      resetShooter();
    }
  });
};