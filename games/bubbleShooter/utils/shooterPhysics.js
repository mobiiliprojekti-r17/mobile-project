import Matter from 'matter-js';

export const getRandomPastelColor = () => {
  const pastelColors = [
    '#F8BBD0', 
    '#E1BEE7', 
    '#B2EBF2', 
    '#C8E6C9', 
    '#FFF9C4', 
  ];

  const randomIndex = Math.floor(Math.random() * pastelColors.length);
  return pastelColors[randomIndex];
};

export const createPhysics = (screenWidth, screenHeight) => {
  const engine = Matter.Engine.create();
  const world = engine.world;
  engine.world.gravity.x = 0;
  engine.world.gravity.y = 0.1; 
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
  ball.id = ball.id || Matter.Common.nextId();
  Matter.World.add(world, ball);

  return ball;
};

export const createStaticBalls = (world, numRows, numCols, screenWidth) => {
  const staticBallRadius = 20;
  const staticBallsArray = [];
  const horizontalSpacing = staticBallRadius * 2 * 1.05;  
  const verticalSpacing = staticBallRadius * 2 * 1.05;    
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const xPos = (col + 1) * horizontalSpacing;  
      const yPos = 80 + row * verticalSpacing;    

      const staticBall = Matter.Bodies.circle(xPos, yPos, staticBallRadius, {
        isStatic: true,
        restitution: 0,
        collisionFilter: {
          category: 0x0001,
          mask: 0x0002,
        },
      });

      staticBall.color = getRandomPastelColor();
      staticBall.id = `static-${row}-${col}`;

      Matter.World.add(world, staticBall);
      staticBallsArray.push(staticBall);
    }
  }

  return staticBallsArray;
};


export const updatePhysics = (engine) => {
  Matter.Engine.update(engine);
};
