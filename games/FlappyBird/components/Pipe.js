// Tuodaan React ja React Native -komponentit sekä vakioarvot
import React from 'react';
import { View } from 'react-native';
import { MAX_HEIGHT } from './constants'; // Näytön korkeus, aukon määrittelyyn

/**
 * Pipe-komponentti: renderöi yksittäisen putki-entiteetin räätälöidyillä väreillä,
 * rimoituksella ja kannella.
 * @param {object} props.body - Matter.js-kehon tiedot (koordinatit, rajat)
 */
const Pipe = ({ body }) => {
  // Lasketaan putken leveys ja korkeus fysiikkakehon rajoista
  const width  = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  // Sijoitetaan putki keskitetyksi kehon x/y-sijainnin perusteella
  const x      = body.position.x - width  / 2;
  const y      = body.position.y - height / 2;

  // Määritellään, onko kyseessä yläputki vai alaputki
  const isTopPipe = body.position.y < MAX_HEIGHT / 2;

  // Värit putkia varten
  const BASE   = '#4FD1D9';   // Pääväri
  const BAND   = 'lightgreen';// Vaihtoväri rämybändiin
  const LIGHT  = '#7FE7EF';   // Valoisuusvarjo
  const SHADOW = '#257784';   // Varjostus

  // Kannen ja nauhojen korkeudet, ruuvin koko ja offset
  const CAP_H      = 24;
  const BAND_H     = 32;
  const boltSize   = 6;
  const boltOffset = 10;

  // Luo putken pystyyn menevät nauhat, jotka vuorottelevat väreissä
  const bands = [];
  for (let i = 0; i < height; i += BAND_H) {
    bands.push(
      <View
        key={`band-${i}`}
        style={{
          position: 'absolute',
          top:      i,           // Sijoitetaan kuhunkin nauhaan pystysuunnassa
          left:     0,
          right:    0,
          height:   BAND_H,
          backgroundColor: (i / BAND_H) % 2 === 0 ? BASE : BAND,
        }}
      />
    );
  }

  
   // Cap-komponentti: renderöi putken ylä- tai alaläpän,
   // johon on piirretty ruuvit.
   
  const Cap = () => (
    <View
      style={{
        position: 'absolute',
        left:  -width * 0.15,               // Kansi on leveämpi kuin putki
        width:  width * 1.3,
        height: CAP_H,
        backgroundColor: BASE,
        // Pyöristetyt kulmat riippuen putken suuntaisuudesta
        borderTopLeftRadius:     isTopPipe ? 0 : 12,
        borderTopRightRadius:    isTopPipe ? 0 : 12,
        borderBottomLeftRadius:  isTopPipe ? 12 : 0,
        borderBottomRightRadius: isTopPipe ? 12 : 0,
        borderWidth: 2,
        borderColor: SHADOW,
        top: isTopPipe ? height - CAP_H : 0, // Sijoitus ylä-/alaputkessa
        justifyContent: 'center',
        alignItems:     'center',
      }}
    >
      {/* Piirretään kaksi "ruuvia" kannen keskelle kummallekin sivulle */}
      {['left', 'right'].map(side => (
        <View
          key={side}
          style={{
            position: 'absolute',
            top:      CAP_H / 2 - boltSize / 2,
            [side]:   boltOffset,
            width:    boltSize,
            height:   boltSize,
            borderRadius: boltSize / 2,
            backgroundColor: SHADOW,
            opacity: 0.6,
          }}
        />
      ))}
    </View>
  );

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top:  y,
        width,
        height,
        overflow: 'hidden', // Leikkaa ylimääräiset osat nauhojen ja kannen ulkopuolelta
      }}
    >
      {/* Tausta nauha */}
      {bands}

      {/* Varjostus putken vasemmassa reunassa */}
      <View
        style={{
          position: 'absolute',
          top:    0,
          left:   0,
          width:  width * 0.15,
          height: '100%',
          backgroundColor: SHADOW,
          opacity: 0.25,
        }}
      />

      {/* Vaalea highlight putken oikeassa reunassa */}
      <View
        style={{
          position: 'absolute',
          top:   0,
          right: 0,
          width:  width * 0.10,
          height: '100%',
          backgroundColor: LIGHT,
          opacity: 0.25,
        }}
      />

      {/* Putken kansi */}
      <Cap />
    </View>
  );
};

export default Pipe;