// Tuodaan Matter.js fysiikkakirjasto ja renderöintikomponentit
import Matter from "matter-js";
import { Paddle, Ball, Brick } from "../components/BrickBreakRender";
import { Dimensions } from "react-native";

// Lasketaan näytön leveys ja skaalauskertoimeksi verrataan 400 px perusleveyteen
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const scaleFactor = SCREEN_WIDTH / 400;

// Physics-system: päivittää fysiikkamoottorin tilan ja käsittelee törmäykset
export const Physics = (entities, { time, dispatch }) => {
  // Haetaan moottori entiteeteistä
  const engine = entities.physics.engine;
  // Kiinteä aikasteppi, maksimi 16 ms
  const fixedDelta = Math.min(time.delta, 16.000);
  // Päivitetään fysiikkamoottori
  Matter.Engine.update(engine, fixedDelta);

  // Käydään läpi kaikki pallo-entiteetit (ball, ball_extra tms.)
  Object.keys(entities)
    .filter((key) => key.startsWith("ball"))
    .forEach((key) => {
      const ball = entities[key].body;
      const paddle = entities.paddle.body;

      // Mailan ja pallon törmäys
      const paddleCollision = Matter.Collision.collides(ball, paddle);
      if (
        paddleCollision &&
        ball.velocity.y > 0 &&
        ball.position.y < paddle.position.y
      ) {
        // Lasketaan törmäyspisteen suhteellinen sijainti mailan keskelle
        const paddleWidth = paddle.bounds.max.x - paddle.bounds.min.x;
        let relativeIntersectX =
          (ball.position.x - paddle.position.x) / (paddleWidth / 2);
        relativeIntersectX = Math.max(-1, Math.min(1, relativeIntersectX));

        // Rajaan pompunkulman n. 45°
        const maxBounceAngle = Math.PI / 4;
        const bounceAngle = relativeIntersectX * maxBounceAngle;

        // Säilytetään nopeuden suuruus, muutetaan suuntaa
        const speed = Math.sqrt(
          ball.velocity.x ** 2 + ball.velocity.y ** 2
        );
        const newVelX = speed * Math.sin(bounceAngle);
        const newVelY = -speed * Math.cos(bounceAngle);
        Matter.Body.setVelocity(ball, { x: newVelX, y: newVelY });
      }

      // Tarkistus: onko tiiliä jäljellä
      let bricksLeft = false;
      Object.keys(entities)
        .filter((key) => key.startsWith("brick_"))
        .forEach((brickKey) => {
          const brickBody = entities[brickKey]?.body;
          if (!brickBody) return;
          bricksLeft = true;

          // Törmäys pallon ja tiilen välillä
          const collision = Matter.Collision.collides(ball, brickBody);
          if (collision) {
            // Lasketaan lähin kontaktipiste tiilille
            const closestX = Math.max(
              brickBody.bounds.min.x,
              Math.min(ball.position.x, brickBody.bounds.max.x)
            );
            const closestY = Math.max(
              brickBody.bounds.min.y,
              Math.min(ball.position.y, brickBody.bounds.max.y)
            );
            const contactPoint = Matter.Vector.create(closestX, closestY);

            // Normaalivektori ja heijastettu nopeusvektori
            const normal = Matter.Vector.normalise(
              Matter.Vector.sub(ball.position, contactPoint)
            );
            const velocity = Matter.Vector.create(
              ball.velocity.x,
              ball.velocity.y
            );
            const dotProduct = Matter.Vector.dot(velocity, normal);
            const reflection = Matter.Vector.sub(
              velocity,
              Matter.Vector.mult(normal, 2 * dotProduct)
            );

            Matter.Body.setVelocity(ball, {
              x: reflection.x,
              y: reflection.y,
            });

            // Käsitellään tiilen tyypin mukaan: normal, double, white
            const brickType = entities[brickKey].brickType;

            if (brickType === "double") {
              // "kova" tiili vaatii kaksi osumaa
              if (entities[brickKey].hits > 1) {
                entities[brickKey].hits -= 1;
                entities[brickKey].damaged = true; // Muutetaan visuaalinen tila
                dispatch({ type: "increase-score" });
              } else {
                // Toisella osumalla poistetaan tiili
                dispatch({ type: "increase-score" });
                Matter.World.remove(engine.world, brickBody);
                delete entities[brickKey];
              }
            } else if (brickType === "white") {
              // Valkoinen tiili luo toisen pallon
              console.log("White tile hit! Spawning extra ball.");
              dispatch({ type: "increase-score" });
              const newBallId = `ball_extra_${Date.now()}_${Math.floor(
                Math.random() * 1000000
              )}`;
              // Luodaan uusi pallo nykyisestä sijainnista
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

              // Satunnainen pastellisävy
              const pastelColors = [
                "#90CAF9",
                "#A5D6A7",
                "#CE93D8",
                "#80CBC4",
                "#F48FB1",
                "#B39DDB"
              ];
              const randomColor =
                pastelColors[Math.floor(Math.random() * pastelColors.length)];
              entities[newBallId] = {
                body: newBall,
                renderer: Ball,
                color: randomColor,
              };

              // Poistetaan valkoinen tiili
              Matter.World.remove(engine.world, brickBody);
              delete entities[brickKey];
            } else {
              // Tavallinen tiili
              dispatch({ type: "increase-score" });
              Matter.World.remove(engine.world, brickBody);
              delete entities[brickKey];
            }
          }
        });

      // Tarkistetaan, onko pallo tippunut mailan alapuolelle
      if (ball.position.y > 700 * scaleFactor) {
        Matter.World.remove(engine.world, ball);
        delete entities[key];

        // Jos palloja ei ole enää jäljellä, peli hävitty
        const ballsRemaining = Object.keys(entities).filter(
          (k) => k.startsWith("ball_") || k === "ball"
        );
        if (ballsRemaining.length === 0) {
          dispatch({ type: "game-over" });
        }
      }

      // Jos tiilet loppuvat = taso läpi
      if (!bricksLeft) {
        dispatch({ type: "level-cleared" });
      }

      // Tarkistetaan törmäykset vasemman ja oikean seinän sekä katon kanssa
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

      // Varmistetaan miniminopeus, jotta pallo ei hidastu liikaa
      const minSpeed = 4;
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

  // Palautetaan päivitetyt entiteetit renderöitäviksi
  return entities;
};
