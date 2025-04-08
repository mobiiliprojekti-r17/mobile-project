import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import BubbleShooter from '../components/BubbleShooter';
import shooterStyles from '../styles/shooterStyles';

const BubbleShooterScreen = ({ navigation }) => {

  return (
    <View style={shooterStyles.ShooterScreenContainer}>
      <BubbleShooter navigation={navigation} />

      <View style={shooterStyles.shooterFooter}>
        <TouchableOpacity
          style={shooterStyles.shooterButton}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={shooterStyles.shooterButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BubbleShooterScreen;
