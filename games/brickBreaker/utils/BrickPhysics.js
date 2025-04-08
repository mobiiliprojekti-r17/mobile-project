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

      const paddleCollision = Matter.Collision.collides(ball, paddle);
      if (paddleCollision && ball.velocity.y > 0 && ball.position.y < paddle.position.y) {
        const paddleWidth = paddle.bounds.max.x - paddle.bounds.min.x;
        let relativeIntersectX = (ball.position.x - paddle.position.x) / (paddleWidth / 2);
        relativeIntersectX = Math.max(-1, Math.min(1, relativeIntersectX));

        const maxBounceAngle = Math.PI / 4;
        const bounceAngle = relativeIntersectX * maxBounceAngle;

        const speed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);
        const newVelX = speed * Math.sin(bounceAngle);
        const newVelY = -speed * Math.cos(bounceAngle);
        Matter.Body.setVelocity(ball, { x: newVelX, y: newVelY });
      }

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

            Matter.World.remove(engine.world, brick);
            delete entities[brickKey];
            dispatch({ type: "increase-score" });

            if (brick.label.includes("special")) {
              const newBallId = `ball_extra_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
              
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
              
              Matter.Body.setVelocity(newBall, { x: ball.velocity.x, y: ball.velocity.y });
              Matter.World.add(engine.world, newBall);
            
              const pastelColors = [
                "#FFB3BA",
                "#FFDFBA",
                "#FFFFBA",
                "#BAFFC9",
                "#BAE1FF",
                "#E3BAFF",
              ];
              
              const randomColor = pastelColors[Math.floor(Math.random() * pastelColors.length)];
            
              entities[newBallId] = {
                body: newBall,
                renderer: Ball, 
                color: randomColor,
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
      const currentSpeed = Math.sqrt(ball.velocity.x ** 2 + ball.velocity.y ** 2);
      if (currentSpeed < minSpeed) {
        const scale = minSpeed / (currentSpeed || 1);
        Matter.Body.setVelocity(ball, { x: ball.velocity.x * scale, y: ball.velocity.y * scale });
      }
    });

  return entities;
};
