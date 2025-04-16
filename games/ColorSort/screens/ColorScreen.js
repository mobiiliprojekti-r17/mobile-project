import React from "react";
import { TouchableOpacity, View } from 'react-native';
import { Icon } from "react-native-paper";
import ColorBoard from "../components/ColorBoard";
import styles from "../styles/Styles";

const ColorGame = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <ColorBoard />

        </View>
    );
};

export default ColorGame;
