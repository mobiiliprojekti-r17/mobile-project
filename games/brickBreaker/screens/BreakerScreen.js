// Tuodaan React ja React Native -komponentit
import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

// Tuodaan peli- ja tyylikomponentit
import BrickBreaker from '../components/BrickBreaker';
import BreakerStyles from '../styles/BreakerStyles';

/**
 * BrickBreakerScreen-komponentti: pääkomponentti, joka yhdistää
 * tiilisäröpelin (BrickBreaker) ja kotinapin näkymässä.
 * @param {object} navigation - React Navigation -prop, jolla ohjataan näkymien vaihtoa
 */
const BrickBreakerScreen = ({ navigation }) => {
  return (
    <View style={BreakerStyles.container}>
      {/* Pelialue */}
      <View style={BreakerStyles.gameContainer}>
        {/* BrickBreaker-komponentti sisältää varsinainen pelilogiikan ja renderöinnin */}
        <BrickBreaker navigation={navigation} />
      </View>

      {/* Kotinapin container alaosassa */}
      <View style={BreakerStyles.buttonContainer}>
        <TouchableOpacity
          style={BreakerStyles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          {/* Home-teksti painikkeessa */}
          <Text style={BreakerStyles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default BrickBreakerScreen;
