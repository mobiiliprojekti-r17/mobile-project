import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import BubbleShooter from '../components/BubbleShooter';
import shooterStyles from '../styles/shooterStyles';

const BubbleShooterScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <BubbleShooter navigation={navigation} />
            <TouchableOpacity style={shooterStyles.button} onPress={() => navigation.navigate("Home")}>
                <Text style={shooterStyles.buttonText}>Home</Text>
              </TouchableOpacity> 
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
