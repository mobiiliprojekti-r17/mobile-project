import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import BrickBreaker from '../components/BrickBreaker';

const BrickBreakerScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <BrickBreaker />
      <Button title="Back to Home" onPress={() => navigation.goBack()} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 40,
    },
    button: {
      paddingTop: 20 
    },
  });
  
  export default BrickBreakerScreen;