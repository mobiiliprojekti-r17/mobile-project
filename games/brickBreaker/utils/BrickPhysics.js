

import Matter from "matter-js";
import { Paddle, Ball, Brick } from "../components/BrickBreakRender";
import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scaleFactor = SCREEN_WIDTH / 400;

export const Physics = (entities, { time, dispatch }) => {
  const engine = entities.physics.engine;
  Matter.Engine.update(engine, time.delta);

  Object.keys(entities)
    .filter((key) => key.startsWith("ball"))
    .forEach((key) => {
      const ball = entities[key].body;
      const paddle = entities.paddle.body;

      const paddleCollision = Matter.Collision.collides(ball, paddle);
      if (
        paddleCollision &&
        ball.velocity.y > 0 &&
        ball.position.y < paddle.position.y
      ) {
        const paddleWidth = paddle.bounds.max.x - paddle.bounds.min.x;
        let relativeIntersectX =
          (ball.position.x - paddle.position.x) / (paddleWidth / 2);
        relativeIntersectX = Math.max(-1, Math.min(1, relativeIntersectX));

        const maxBounceAngle = Math.PI / 4;
        const bounceAngle = relativeIntersectX * maxBounceAngle;

        const speed = Math.sqrt(
          ball.velocity.x ** 2 + ball.velocity.y ** 2
        );
        const newVelX = speed * Math.sin(bounceAngle);
        const newVelY = -speed * Math.cos(bounceAngle);
        Matter.Body.setVelocity(ball, { x: newVelX, y: newVelY });
      }

      let bricksLeft = false;
      Object.keys(entities)
        .filter((key) => key.startsWith("brick_"))
        .forEach((brickKey) => {
          let brickBody = entities[brickKey]?.body;
          if (!brickBody) return;
          bricksLeft = true;

          const collision = Matter.Collision.collides(ball, brickBody);
          if (collision) {
            const closestX = Math.max(
              brickBody.bounds.min.x,
              Math.min(ball.position.x, brickBody.bounds.max.x)
            );
            const closestY = Math.max(
              brickBody.bounds.min.y,
              Math.min(ball.position.y, brickBody.bounds.max.y)
            );
            const contactPoint = Matter.Vector.create(closestX, closestY);
            const normal = Matter.Vector.normalise(
              Matter.Vector.sub(ball.position, contactPoint)
            );
            const velocity = Matter.Vector.create(ball.velocity.x, ball.velocity.y);
            const dotProduct = Matter.Vector.dot(velocity, normal);
            const reflection = Matter.Vector.sub(
              velocity,
              Matter.Vector.mult(normal, 2 * dotProduct)
            );

            Matter.Body.setVelocity(ball, {
              x: reflection.x,
              y: reflection.y,
            });

            const brickType = entities[brickKey].brickType;

            if (brickType === "double") {
              if (entities[brickKey].hits > 1) {
                entities[brickKey].hits -= 1;
                entities[brickKey].damaged = true;
                dispatch({ type: "increase-score" });
              } else {
                dispatch({ type: "increase-score" });
                Matter.World.remove(engine.world, brickBody);
                delete entities[brickKey];
              }
            } else if (brickType === "white") {
              console.log("White tile hit! Spawning extra ball.");
              dispatch({ type: "increase-score" });
              const newBallId = `ball_extra_${Date.now()}_${Math.floor(
                Math.random() * 1000000
              )}`;
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
              Matter.Body.setVelocity(newBall, {
                x: ball.velocity.x,
                y: ball.velocity.y,
              });
              Matter.World.add(engine.world, newBall);
              const pastelColors = [
                "#90CAF9", // Soft Blue
                "#A5D6A7", // Soft Green
                "#CE93D8", // Soft Purple
                "#80CBC4", // Soft Teal
                "#F48FB1", // Soft Pink
                "#B39DDB"  // Soft Lavender
              ];
              const randomColor =
                pastelColors[Math.floor(Math.random() * pastelColors.length)];
              entities[newBallId] = {
                body: newBall,
                renderer: Ball,
                color: randomColor,
              };
              Matter.World.remove(engine.world, brickBody);
              delete entities[brickKey];
            } else {
              dispatch({ type: "increase-score" });
              Matter.World.remove(engine.world, brickBody);
              delete entities[brickKey];
            }
          }
        });

      if (ball.position.y > 700 * scaleFactor) {
        Matter.World.remove(engine.world, ball);
        delete entities[key];

        const ballsRemaining = Object.keys(entities).filter(
          (k) => k.startsWith("ball_") || k === "ball"
        );
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
        Matter.Body.setVelocity(ball, {
          x: Math.abs(ball.velocity.x),
          y: ball.velocity.y,
        });
      }
      if (Matter.Collision.collides(ball, wallRight)) {
        Matter.Body.setVelocity(ball, {
          x: -Math.abs(ball.velocity.x),
          y: ball.velocity.y,
        });
      }
      if (Matter.Collision.collides(ball, ceiling)) {
        Matter.Body.setVelocity(ball, {
          x: ball.velocity.x,
          y: Math.abs(ball.velocity.y),
        });
      }

      const minSpeed = 3;
      const currentSpeed = Math.sqrt(
        ball.velocity.x ** 2 + ball.velocity.y ** 2
      );
      if (currentSpeed < minSpeed) {
        const speedScale = minSpeed / (currentSpeed || 1);
        Matter.Body.setVelocity(ball, {
          x: ball.velocity.x * speedScale,
          y: ball.velocity.y * speedScale,
        });
      }
    });

  return entities;
};
