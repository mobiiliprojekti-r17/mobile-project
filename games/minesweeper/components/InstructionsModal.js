import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import styles from '../styles/minesweeperStyles';

const InstructionsModal = ({ visible, onClose }) => (
  <Modal transparent animationType="fade" visible={visible}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Minesweeper</Text>
        <Text style={styles.instruction}>
          • Napauta paljastaaksesi ruudun.
        </Text>
        <Text style={styles.instruction}>
          • Paina pitkään lipun asettamiseksi.
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.button}>
          <Text style={styles.buttonText}>Aloita</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default InstructionsModal;
