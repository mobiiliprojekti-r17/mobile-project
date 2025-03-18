

import Matter from "matter-js";



export const Physics = (entities, { time, dispatch }) => {
  let engine = entities.physics.engine;
  const fixedDeltaTime = 1000 / 60;
  Matter.Engine.update(engine, fixedDeltaTime);
  

  let ball = entities.ball.body;
  let paddle = entities.paddle.body;
  let bricks = Object.keys(entities).filter((key) => key.startsWith("brick_"));

  if (ball.position.y > 600) {  
    dispatch({ type: "game-over" });
  }

  const paddleCollision = Matter.Collision.collides(ball, paddle);
if (paddleCollision) {
    let offset = ((ball.position.x - paddle.position.x) / (paddle.bounds.max.x - paddle.bounds.min.x)) * 2 - 1;
    let speed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);

    let bounceAngle = offset * (Math.PI / 4); // Max ±45 astetta

    let newVelocity = {
        x: Math.sin(bounceAngle) * speed,  // X määräytyy osumakohdan mukaan
        y: -Math.abs(Math.cos(bounceAngle) * speed),  // Y on aina negatiivinen (pallo menee ylöspäin)
    };

    Matter.Body.setVelocity(ball, newVelocity);
}

  
  Matter.Events.on(engine, "collisionStart", (event) => {
    event.pairs.forEach((collision) => {
      let { bodyA, bodyB } = collision;
      
      if (bodyA.label === "ball" && bodyB.label.startsWith("brick")) {
        Matter.World.remove(engine.world, bodyB);
        dispatch({ type: "increase-score" });
      } else if (bodyB.label === "ball" && bodyA.label.startsWith("brick")) {
        Matter.World.remove(engine.world, bodyA);
        dispatch({ type: "increase-score" });
      }
    });
  });


  bricks.forEach((key) => {
    let brick = entities[key]?.body;
    if (!brick) return;
    let dx = Math.abs(ball.position.x - brick.position.x);
    let dy = Math.abs(ball.position.y - brick.position.y);
  
    if (dx < 30 && dy < 15) { 
      Matter.World.remove(engine.world, brick);
      dispatch({ type: "remove-brick", key });
  
      Matter.Body.setVelocity(ball, {
        x: ball.velocity.x,
        y: -ball.velocity.y,
      });
    }
    const collision = Matter.Collision.collides(ball, brick);
    if (collision) {
      Matter.World.remove(engine.world, brick);
      dispatch({ type: "increase-score" });
    
      delete entities[key];
    
    

      let ballVelocity = ball.velocity;
      let ballPos = ball.position;
      let brickPos = brick.position;

      let impactFromTopOrBottom = Math.abs(ballPos.y - brickPos.y) > Math.abs(ballPos.x - brickPos.x);
      let newVelocityX = ballVelocity.x;
      let newVelocityY = ballVelocity.y;

      if (impactFromTopOrBottom) {
        newVelocityY = -newVelocityY;
      } else {
        newVelocityX = -newVelocityX;
      }

      Matter.Body.setVelocity(ball, { x: newVelocityX, y: newVelocityY });
    }
  });

  const maxSpeed = 3; 

  if (Math.abs(ball.velocity.x) > maxSpeed) {
    Matter.Body.setVelocity(ball, { x: Math.sign(ball.velocity.x) * maxSpeed, y: ball.velocity.y });
  }
  
  if (Math.abs(ball.velocity.y) > maxSpeed) {
    Matter.Body.setVelocity(ball, { x: ball.velocity.x, y: Math.sign(ball.velocity.y) * maxSpeed });
  }
  
  
  const substeps = 6; 
for (let i = 0; i < substeps; i++) {
  Matter.Engine.update(engine, time.delta / substeps);
}

  if (Math.abs(ball.velocity.x) < 2) {
    Matter.Body.setVelocity(ball, { x: ball.velocity.x > 0 ? 2 : -2, y: ball.velocity.y });
  }
  if (Math.abs(ball.velocity.y) < 2) {
    Matter.Body.setVelocity(ball, { x: ball.velocity.x, y: ball.velocity.y > 0 ? 2 : -2 });
  }

  const wallLeft = entities.wallLeft.body;
  const wallRight = entities.wallRight.body;
  const ceiling = entities.ceiling.body;

  const leftCollision = Matter.Collision.collides(ball, wallLeft);
  if (leftCollision) {
    Matter.Body.setVelocity(ball, { x: Math.abs(ball.velocity.x), y: ball.velocity.y });
  }

  const rightCollision = Matter.Collision.collides(ball, wallRight);
  if (rightCollision) {
    Matter.Body.setVelocity(ball, { x: -Math.abs(ball.velocity.x), y: ball.velocity.y });
  }

  const ceilingCollision = Matter.Collision.collides(ball, ceiling);
  if (ceilingCollision) {
    Matter.Body.setVelocity(ball, { x: ball.velocity.x, y: Math.abs(ball.velocity.y) });
  }

  const remainingBricks = Object.keys(entities).filter((key) => key.startsWith("brick_"));
  if (remainingBricks.length === 0) {
    dispatch({ type: "game-over" });
  }

  return entities;
};
