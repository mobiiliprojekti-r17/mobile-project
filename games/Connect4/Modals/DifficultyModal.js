// src/Modals/DifficultyModal.js

import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/ModalStyles';

const DifficultyModal = ({ visible, onSelect, onCancel }) => (
  <Modal transparent animationType="fade" visible={visible}>
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Choose difficulty</Text>
        {['easy', 'medium', 'impossible'].map(level => (
          <TouchableOpacity
            key={level}
            style={styles.button}
            onPress={() => onSelect(level)}
          >
            <Text style={styles.buttonText}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Cancel-nappi */}
        <TouchableOpacity
          style={styles.button}
          onPress={onCancel}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default DifficultyModal;
