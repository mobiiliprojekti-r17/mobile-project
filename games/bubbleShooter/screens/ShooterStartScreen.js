
import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const ShooterStartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button 
        title="Start Game" 
        onPress={() => navigation.navigate('GameScreen')} // Navigoi GameScreeniin
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ShooterStartScreen;
