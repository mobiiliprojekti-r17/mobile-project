import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import BubbleShooter from '../components/ShooterBoard';

const BubbleShooterScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <BubbleShooter /> 
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: 40,
    },
    button: {
      paddingTop: 20  // Lisää etäisyyttä napin yläpuolelle
    },
  });
  
  export default BubbleShooterScreen;