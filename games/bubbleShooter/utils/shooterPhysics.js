import Matter from 'matter-js';

// Luo pelin fysiikkamoottorin ja maailman
export const createPhysics = () => {
  const engine = Matter.Engine.create();
  const world = engine.world;
  engine.world.gravity.x = 0;
  engine.world.gravity.y = 0;

  return { engine, world };
};

// Luo ammuntapallon, joka ei pomppaa ennen ampumista
export const createShooterBall = (world, x, y, radius) => {
  const ball = Matter.Bodies.circle(x, y, radius, {
    restitution: 0, // Ei pomppua, kun pallo ei ole ammuttu
    frictionAir: 0.01,
    density: 0.001,
    inertia: Infinity,
    friction: 0,
    
  });

  Matter.World.add(world, ball);
  return ball;
};

// Luo staattiset pallot pelissä
export const createStaticBalls = (world, numRows, numCols, screenWidth) => {
  const staticBallRadius = 20;
  const staticBallsArray = [];

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const xPos = (screenWidth / (numCols + 1)) * (col + 1);
      const yPos = 100 + row * (staticBallRadius * 2 + 10);
      const staticBall = Matter.Bodies.circle(xPos, yPos, staticBallRadius, { isStatic: true });
      Matter.World.add(world, staticBall);
      staticBallsArray.push(staticBall);
    }
  }

  return staticBallsArray;
};

// Päivittää fysiikan ja tarkistaa törmäykset
export const updatePhysics = (engine, shooterBall, staticBalls, resetShooter) => {
  Matter.Engine.update(engine);

  // Jos pallo on ammuttu, määritellään restitution uudelleen
  if (shooterBall && shooterBall.restitution === 0) {
    shooterBall.restitution = 0.4; // Aseta pallo pomppimaan normaalisti
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
