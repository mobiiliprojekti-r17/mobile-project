import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import ModalStyles from '../styles/ModalStyles';

const InstructionsModal = ({ visible, onClose }) => (
  <Modal transparent animationType="fade" visible={visible}>
    <View style={ModalStyles.modalOverlay}>
      <View style={ModalStyles.modalContent}>
        <Text style={ModalStyles.title}>How to Play</Text>
        <Text style={ModalStyles.instruction}>- Press to reveal the square</Text>
        <Text style={ModalStyles.instruction}>- Press and hold to set the flag</Text>
        <Text style={ModalStyles.instruction}>- If you want to delete a flag, long press</Text>
        <TouchableOpacity onPress={onClose} style={ModalStyles.instructionbutton}>
          <Text style={ModalStyles.instructionbuttonText}>Ok</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default InstructionsModal;