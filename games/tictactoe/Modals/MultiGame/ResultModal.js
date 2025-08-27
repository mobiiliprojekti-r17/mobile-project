import React from 'react';  
import { Modal, View, Text, TouchableOpacity } from 'react-native';  
import styles from '../../styles/TictactoeMultiStyles';  

export default function GameModal({ visible, message, onClose }) {
  return (
    // näyttää Result-ikkunan pelin päätyttyä
    <Modal
      animationType="slide"
      transparent 
      visible={visible}  
      onRequestClose={onClose}  
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{message}</Text>
          <TouchableOpacity
            style={styles.modalButton}
            onPress={onClose}  // Piilottaa modaalin
          >
            <Text style={styles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
