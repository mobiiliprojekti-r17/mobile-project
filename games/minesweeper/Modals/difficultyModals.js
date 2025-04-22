import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import ModalStyles from "../styles/ModalStyles";

// Modal-ikkuna, jossa valitaan vaikeustaso uudelle pelille
const DifficultySelectorModal = ({ visible, onSelect, onCancel }) => {
  return (
    <Modal
      transparent 
      animationType="fade"  
      visible={visible} 
    >
      <View style={ModalStyles.modalOverlay}>
        <View style={ModalStyles.difficultyModalContent}>
          {/* Ohjeteksti */}
          <Text style={ModalStyles.modalText}>Choose difficulty</Text>
          {/* Kolme nappia eri vaikeustasoille */}
          {["EASY", "MEDIUM", "HARD"].map(level => (
            <TouchableOpacity
              key={level}
              onPress={() => onSelect(level)}  // Kutsutaan, kun taso valitaan
              style={ModalStyles.difficultyModalButton}
            >
              <Text style={ModalStyles.modalButtonText}>{level}</Text>
            </TouchableOpacity>
          ))}
          {/* Peruuta-painike sulkee modalin ilman valintaa */}
          <TouchableOpacity
            onPress={onCancel}
            style={ModalStyles.difficultyModalButton}
          >
            <Text style={ModalStyles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DifficultySelectorModal;
