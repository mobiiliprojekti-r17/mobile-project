import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import  ModalStyles  from "../styles/ModalStyles";

const DifficultySelectorModal = ({ visible, onSelect, onCancel }) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={ModalStyles.modalOverlay}>
        <View style={ModalStyles.difficultyModalContent}>
          <Text style={ModalStyles.modalText}>Choose difficulty</Text>
          {["EASY", "MEDIUM", "HARD"].map((level) => (
            <TouchableOpacity
              key={level}
              onPress={() => onSelect(level)}
              style={ModalStyles.difficultyModalButton}
            >
              <Text style={ModalStyles.modalButtonText}>{level}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={onCancel} style={ModalStyles.difficultyModalButton}>
            <Text style={ModalStyles.modalButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default DifficultySelectorModal;