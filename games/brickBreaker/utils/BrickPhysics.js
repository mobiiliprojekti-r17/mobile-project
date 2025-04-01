


import Matter from "matter-js";
import { Paddle, Ball, Brick } from "../components/BrickBreakRender";

export const Physics = (entities, { time, dispatch }) => {
  const engine = entities.physics.engine;
  Matter.Engine.update(engine, time.delta);

  Object.keys(entities)
    .filter((key) => key.startsWith("ball"))
    .forEach((key) => {
      const ball = entities[key].body;
      const paddle = entities.paddle.body;
//-------------------------------------------------------------------

const paddleCollision = Matter.Collision.collides(ball, paddle);
if (paddleCollision && ball.velocity.y > 0 && ball.position.y < paddle.position.y) {
  const paddleWidth = paddle.bounds.max.x - paddle.bounds.min.x;
  let relativeIntersectX = (ball.position.x - paddle.position.x) / (paddleWidth / 2);
  relativeIntersectX = Math.max(-1, Math.min(1, relativeIntersectX));
  
  const maxBounceAngle = Math.PI / 4;
  const bounceAngle = relativeIntersectX * maxBounceAngle;
  
  // Maintain ball's speed after collision
  const speed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);
  const newVelX = speed * Math.sin(bounceAngle);
  const newVelY = -speed * Math.cos(bounceAngle);
  
  Matter.Body.setVelocity(ball, { x: newVelX, y: newVelY });
}

//------------------------------------------------------------------
/*
      const paddleCollision = Matter.Collision.collides(ball, paddle);
      if (paddleCollision) {
        let relativeIntersectX = (ball.position.x - paddle.position.x) /
          (paddle.bounds.max.x - paddle.bounds.min.x);
        let bounceAngle = relativeIntersectX * (Math.PI / 4);
        let speed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);

        let newVelocity = {
          x: Math.sin(bounceAngle) * speed,
          y: -Math.abs(Math.cos(bounceAngle) * speed),
        };
        Matter.Body.setVelocity(ball, newVelocity);
      }
*/
      let bricksLeft = false;
      Object.keys(entities)
        .filter((key) => key.startsWith("brick_"))
        .forEach((brickKey) => {
          let brick = entities[brickKey]?.body;
          if (!brick) return;

          bricksLeft = true; 

          const collision = Matter.Collision.collides(ball, brick);
          if (collision) {
            const closestX = Math.max(brick.bounds.min.x, Math.min(ball.position.x, brick.bounds.max.x));
            const closestY = Math.max(brick.bounds.min.y, Math.min(ball.position.y, brick.bounds.max.y));
            const contactPoint = Matter.Vector.create(closestX, closestY);
            const normal = Matter.Vector.normalise(Matter.Vector.sub(ball.position, contactPoint));
            const velocity = Matter.Vector.create(ball.velocity.x, ball.velocity.y);
            const dotProduct = Matter.Vector.dot(velocity, normal);
            const reflection = Matter.Vector.sub(velocity, Matter.Vector.mult(normal, 2 * dotProduct));

            Matter.Body.setVelocity(ball, { x: reflection.x, y: reflection.y });

            //---------------------------------------------------------------------------------------------------------------
            const desiredSpeed = entities.ball.fixedSpeed || 3;
            const currentSpeed = Math.sqrt(reflection.x ** 2 + reflection.y ** 2);
            if (currentSpeed > 0) {
              const scale = desiredSpeed / currentSpeed;
              const newVelocity = {
                x: reflection.x * scale,
                y: reflection.y * scale
              };
              Matter.Body.setVelocity(ball, newVelocity);
            }
            if (key === "ball") {
              const desiredSpeed = entities.ball.fixedSpeed || 3;
              const currentSpeedFinal = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);
              if (currentSpeedFinal > 0) {
                const scale = desiredSpeed / currentSpeedFinal;
                Matter.Body.setVelocity(ball, {
                  x: ball.velocity.x * scale,
                  y: ball.velocity.y * scale,
                });
              }
            }
            //---------------------------------------------------------------------------------------------------------------

            Matter.World.remove(engine.world, brick);
            delete entities[brickKey];
            dispatch({ type: "increase-score" });

            if (brick.label.includes("special")) {

            
              const newBallId = `ball_extra_${Date.now()}`;
  
              const newBall = Matter.Bodies.circle(
                ball.position.x,
                ball.position.y,
                10,
                {
                  label: newBallId,
                  restitution: 1,
                  friction: 0,
                  frictionAir: 0,
                  inertia: Infinity,
                  collisionFilter: { group: 0 },
                }
              );

              Matter.Body.setVelocity(newBall, { x: 3, y: -5 });
              Matter.World.add(engine.world, newBall);

              entities[`ball_extra_${Date.now()}`] = {
                body: newBall,
                renderer: entities.ball.renderer, 
              };

            }
          }
        });
  if (ball.position.y > 600) {
  Matter.World.remove(engine.world, ball);
  delete entities[key];
  
  const ballsRemaining = Object.keys(entities).filter((k) => k.startsWith("ball_") || k === "ball");
  if (ballsRemaining.length === 0) {
    dispatch({ type: "game-over" });
  }
}


        if (!bricksLeft) {
          dispatch({ type: "level-cleared" }); 
        }
        

      const wallLeft = entities.wallLeft.body;
      const wallRight = entities.wallRight.body;
      const ceiling = entities.ceiling.body;

      if (Matter.Collision.collides(ball, wallLeft)) {
        Matter.Body.setVelocity(ball, { x: Math.abs(ball.velocity.x), y: ball.velocity.y });
      }
      if (Matter.Collision.collides(ball, wallRight)) {
        Matter.Body.setVelocity(ball, { x: -Math.abs(ball.velocity.x), y: ball.velocity.y });
      }
      if (Matter.Collision.collides(ball, ceiling)) {
        Matter.Body.setVelocity(ball, { x: ball.velocity.x, y: Math.abs(ball.velocity.y) });
      }



      const minSpeed = 3;
      if (Math.abs(ball.velocity.x) < minSpeed) {
        Matter.Body.setVelocity(ball, { x: Math.sign(ball.velocity.x) * minSpeed, y: ball.velocity.y });
      }
      if (Math.abs(ball.velocity.y) < minSpeed) {
        Matter.Body.setVelocity(ball, { x: ball.velocity.x, y: Math.sign(ball.velocity.y) * minSpeed });
      }
    });

return entities;
};