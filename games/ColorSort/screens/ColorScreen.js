import React from "react";
import { View } from 'react-native';
import ColorBoard from "../components/ColorBoard";
import styles from "../styles/Styles";

const ColorGame = () => {
    return (
        <View style={styles.container}>
            <ColorBoard />

        </View>
    );
};

export default ColorGame;
