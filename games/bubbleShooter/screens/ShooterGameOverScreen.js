import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useEffect } from 'react';

const ShooterGameOver = ({ navigation }) => {

useEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,  
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Play Again"
          onPress={() => navigation.replace('BubbleShooter')}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button 
          title="Back to Menu"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    color: '#fff',
    marginBottom: 40,
  },
  buttonContainer: {
    marginVertical: 10,
    width: 200,
  }
});

export default ShooterGameOver;