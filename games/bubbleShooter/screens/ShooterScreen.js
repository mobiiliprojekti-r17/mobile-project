import React from 'react';
import { View, StyleSheet } from 'react-native';
import BubbleShooter from '../components/BubbleShooter';

const BubbleShooterScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <BubbleShooter navigation={navigation} /> 
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 40,
  },
});

export default BubbleShooterScreen;
