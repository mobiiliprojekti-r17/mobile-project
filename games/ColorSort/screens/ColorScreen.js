import React from "react";
import {View, Button, StyleSheet} from 'react-native';
import ColorBoard from "../components/ColorBoard";

const ColorGame = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ColorBoard/>
          <Button title="Back to Home" onPress={() => navigation.goBack()} />
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 40,
        backgroundColor:'#B09AFF',
    },
    button: {
        paddingTop: 20  
    },
});

export default ColorGame;