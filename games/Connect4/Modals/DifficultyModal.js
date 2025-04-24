import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/ModalStyles';

// Modal-ikkuna, jossa valitaan tekoälyn vaikeustaso
const DifficultyModal = ({ visible, onSelect, onCancel }) => (
  <Modal
    transparent  
    animationType="fade" 
    visible={visible}
  >
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Text style={styles.title}>Choose difficulty</Text>
        {/* Kolme nappia eri vaikeustasoille */}
        {['easy', 'medium', 'impossible'].map(level => (
          <TouchableOpacity
            key={level}                 // Avain Reactille listassa
            style={styles.button}       // Yhden napin ulkoasu
            onPress={() => onSelect(level)}  // Kutsutaan, kun taso valitaan
          >
            <Text style={styles.buttonText}>
              {/* Muuntaa "easy" → "Easy" */}
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Peruuta-painike, joka sulkee modalin */}
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
