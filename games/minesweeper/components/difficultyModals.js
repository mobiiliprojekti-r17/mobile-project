// components/DifficultySelectorModal.js
import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { styles } from "../styles/minesweeperStyles";

const DifficultySelectorModal = ({ visible, onSelect, onCancel }) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.modalOverlay}>
        <View style={styles.difficultyModalContent}>
          <Text style={styles.modalText}>Choose difficulty</Text>
          {["easy", "medium", "hard"].map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => onSelect(level)}
              style={styles.difficultyModalButton}
            >
              <Text style={styles.modalButtonText}>{level}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onCancel} style={styles.difficultyModalButton}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DifficultySelectorModal;
