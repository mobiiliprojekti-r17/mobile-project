// Tuodaan React ja React Native -komponentit
import React from 'react';
import { Image } from 'react-native';

/**
 * Bird-komponentti: renderöi pelikentällä liikkuvan linnun kuvan
 * ja kääntää sitä pystysuuntaisen nopeuden mukaan.
 * @param {object} props.body - Matter.js-keho, josta haetaan sijainti ja nopeus
 */
const Bird = (props) => {
  // Määritellään linnun kuvakkeen leveys ja korkeus
  const birdWidth = 50;
  const birdHeight = 50;

  // Lasketaan absoluuttiset x- ja y-koordinaatit kuvan keskipisteelle
  const x = props.body.position.x - birdWidth / 2;
  const y = props.body.position.y - birdHeight / 2;

  // Haetaan lintukehosta pystysuuntainen nopeus, oletuksena 0
  const velocityY = (props.body.velocity && props.body.velocity.y) || 0;

  // Muotoillaan kääntökulma nopeuden perusteella: skaalauskerroin 3
  let angle = velocityY * 3;
  // Rajataan kääntökulma maksimissaan 30 astetta
  if (angle > 30) angle = 30;
  if (angle < -30) angle = -30;

  return (
    <Image
      // Käytetään kuvaa linnusta
      source={require('../../../assets/FlappyNoBg.png')}
      style={{
        position: 'absolute',           // Vapaasti sijoitettava
        left: x,                        // Lasketut x- ja y-koordinaatit
        top: y,
        width: birdWidth,               // Kuvan koko
        height: birdHeight,
        transform: [{ rotate: `${angle}deg` }], // Kääntökulma
      }}
      resizeMode="contain"           // Säilyttää kuvan mittasuhteet
    />
  );
};

export default Bird;
