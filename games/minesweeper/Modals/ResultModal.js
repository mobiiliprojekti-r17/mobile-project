import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import ModalStyles from "../styles/ModalStyles";

const ResultModal = ({ visible, message, onClose }) => (
  <Modal transparent animationType="fade" visible={visible}>
    <View style={ModalStyles.modalOverlay}>
      <View style={ModalStyles.modalContent}>
        <Text style={ModalStyles.modalText}>Game over!</Text>
        <Text style={ModalStyles.modalText}>{message}</Text>
        <TouchableOpacity onPress={onClose} style={ModalStyles.modalButton}>
          <Text style={ModalStyles.modalButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default ResultModal;
