import React, { useEffect } from "react";
import { View, Text, Button } from "react-native";

export default function SudokuResult({ route, navigation }) {
  const { time, difficulty } = route.params;

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,  
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>Peli päättyi!</Text>
      <Text style={{ fontSize: 18 }}>Vaikeustaso: {difficulty}</Text>
      <Text style={{ fontSize: 18 }}>
        Aika: {Math.floor(time / 60)}:{time % 60 < 10 ? "0" : ""}{time % 60}
      </Text>
      <Button title="Palaa päävalikkoon" onPress={() => navigation.navigate("Home")} />
    </View>
  );
}
