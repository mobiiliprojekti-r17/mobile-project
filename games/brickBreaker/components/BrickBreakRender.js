// Tuodaan React ja React Native -komponentit
import React, { useMemo } from "react";
import { View, Text } from "react-native";

// Paddle-komponentti: renderöi mailan sijainnin ja koon mukaan
export const Paddle = (props) => {
  const { body } = props; // Matter.js -fysiikkarunko

  // Lasketaan mailan leveys ja korkeus
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;

  // Asetetaan absoluuttinen x- ja y-koordinaatti ruudulla
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  const paddleColor = "#F78DA7"; // Mailan väri

  // Palautetaan React Native -View, joka kuvaa mailaa
  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: paddleColor,
        borderRadius: 10, // Pyöristetyt kulmat
        borderWidth: 2,
        borderColor: "black",
        shadowColor: "white",
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 1,
        shadowRadius: 5.5,
      }}
    />
  );
};

// Ball-komponentti: renderöi pallon sijainnin ja teeman mukaan
export const Ball = (props) => {
  const { body, color, themeIndex } = props;
  const { position } = body; // Pallon keskikohta

  // Määritellään pastellisävyt eri teemoille
  const pastelColors = [
    "#FFB3BA",
    "#FFDFBA",
    "#FFFFBA",
    "#BAFFC9",
    "#BAE1FF",
    "#E3BAFF",
  ];

  // Valitaan pallon väri joko props.color tai teemaväri
  const ballColor = color || pastelColors[(themeIndex || 0) % pastelColors.length];

  // Palautetaan View, joka kuvaa palloa
  return (
    <View
      style={{
        position: "absolute",
        width: 24,              // Pallon halkaisija
        height: 24,
        borderRadius: 14,       // Pyöristys
        backgroundColor: ballColor,
        borderWidth: 2,         // Musta reunus
        borderColor: "black",
        left: position.x - 14,  // Keskitetään x
        top: position.y - 14,   // Keskitetään y
        justifyContent: "center",
        alignItems: "center",
        shadowColor: ballColor, // Varjon väri sama kuin pallo
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.6,
        shadowRadius: 3,
      }}
    />
  );
};

// Brick-komponentti: renderöi tiilen muodon, värin ja osuustilan mukaan
export const Brick = (props) => {
  const { body, brickType, damaged, hits } = props;

  // Lasketaan tiilen koko ja sijainti
  const width = body.bounds.max.x - body.bounds.min.x;
  const height = body.bounds.max.y - body.bounds.min.y;
  const x = body.position.x - width / 2;
  const y = body.position.y - height / 2;

  // Määritetään tiilen väri tyyppien perusteella
  let brickColor;
  if (brickType === "white") {
    brickColor = "white";
  } else if (brickType === "double") {
    brickColor = "#7F00FF"; // Kaksinkertainen "kova" tiili
  } else {
    // Muut tiilet saavat pastellisävyt rivin mukaan
    const label = body.label || "";
    const rowMatch = label.match(/brick_\d+_(\d+)/);
    const row = rowMatch ? parseInt(rowMatch[1], 10) : 0;
    const pastelColors = [
      "#FFB3BA",
      "#FFDFBA",
      "#FFFFBA",
      "#BAFFC9",
      "#BAE1FF",
      "#E3BAFF",
    ];
    brickColor = pastelColors[row % pastelColors.length];
  }

  // Läpinäkyvyys, jos tiili on vaurioitunut
  const opacity = damaged ? 0.5 : 1;

  // Ulkokuori tiilelle
  return (
    <View
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: "#d3d3d3", // Kehysväri
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Sisempi tiili, joka näyttää värin ja mahdollisen osuustekstin */}
      <View
        style={{
          width: width - 4,
          height: height - 4,
          backgroundColor: brickColor,
          borderWidth: 1,
          borderColor: "#aaa",
          opacity: opacity,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Jos kaksinkertainen tiili, näytetään jäljellä olevat osumat */}
        {brickType === "double" && (
          <Text style={{ color: "black", fontWeight: "bold" }}>
            {hits}
          </Text>
        )}
        {/* Ylä- ja alareunan highlightit varjonsa varten */}
        <View
          style={{
            position: "absolute",
            top: 2,
            left: 2,
            right: 2,
            height: 1,
            backgroundColor: "rgba(0,0,0,0.1)",
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 2,
            left: 2,
            right: 2,
            height: 1,
            backgroundColor: "rgba(255,255,255,0.3)",
          }}
        />
      </View>
    </View>
  );
};
