import React from "react";
import { Button, StyleSheet, View } from 'react-native';
import ColorBoard from "../components/ColorBoard";

const ColorGame = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ColorBoard />
            <Button title="Back to Home" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 40,
        backgroundColor: '#B09AFF',
    },
});

export default ColorGame;
