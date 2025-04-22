import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import ModalStyles from "../styles/ModalStyles";

// Modal-ikkuna pelin lopputuloksen näyttämiseen
const ResultModal = ({ visible, message, onClose }) => (
  <Modal
    transparent 
    animationType="fade" 
    visible={visible}  
  >
    <View style={ModalStyles.modalOverlay}>
      <View style={ModalStyles.modalContent}>
        <Text style={ModalStyles.modalText}>Game over!</Text>
        {/* Viesti pelin lopputuloksen mukaan */}
        <Text style={ModalStyles.modalText}>{message}</Text>
        {/* Sulje-painike, joka kutsuu onClose-funktiota piilottaakseen modalin */}
        <TouchableOpacity onPress={onClose} style={ModalStyles.modalButton}>
          <Text style={ModalStyles.modalButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default ResultModal;
