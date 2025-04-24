import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/TictactoeSingleStyles';

export default function LevelModal({ visible, onSelect, onCancel }) {
  return (
    // modaali tason valinnalle
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { width: '80%' }]}>
          <Text style={styles.modalText}>Choose difficulty</Text>

          {/* Kolme nappia eri vaikeustasoille */}
          {['easy','medium','impossible'].map(l => (
            <TouchableOpacity
              key={l}
              style={styles.levelButton}
              onPress={() => onSelect(l)}  // Valitaan taso ja suljetaan modal
            >
              <Text style={styles.levelButtonText}>
                {l.charAt(0).toUpperCase() + l.slice(1)} 
              </Text>
            </TouchableOpacity>
          ))}

          {/* Peruuta-painike palaa takaisin ilman valintaa */}
          <TouchableOpacity
            style={styles.levelButton}
            onPress={onCancel}
          >
            <Text style={styles.levelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
