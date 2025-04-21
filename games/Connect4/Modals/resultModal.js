import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import modalStyles from '../styles/ModalStyles'; 

export const ResultModalsingle = ({ visible, winner, onClose }) => {
  const modalBackgroundColor = winner === 'Orange' ? 'rgb(255, 94, 0)' : 'rgb(255, 234, 0)';
  const modalButtonBackgroundColor = winner === 'Orange' ? 'rgb(200, 75, 0)' : 'rgb(255, 204, 0)';
  
  let resultText = 'Game Draw!';
  if(winner === 'Orange') resultText = 'AI win!';
  if(winner === 'Yellow') resultText = 'You win!';

  const resultTextColor = winner === 'Orange'
  ? '#000'
  : winner === 'Yellow'
    ? '#000'
    : '#000';
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={[modalStyles.modalOverlay, { backgroundColor: "rgba(0, 0, 0, 0.4)" }]}>
        <View style={[modalStyles.modalContent, { backgroundColor: modalBackgroundColor }]}>
        <Text style={[modalStyles.modalText, { color: resultTextColor, fontSize: 32 }]}>
            {resultText}
          </Text>
          <TouchableOpacity
            style={[modalStyles.modalButton, { backgroundColor: modalButtonBackgroundColor }]}
            onPress={onClose}
          >
            <Text style={modalStyles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export const ResultModalmulti = ({ visible, winner, onClose }) => {
  const modalBackgroundColor = winner === 'Orange' ? 'rgb(255, 94, 0)' : 'rgb(255, 234, 0)';
  const modalButtonBackgroundColor = winner === 'Orange' ? 'rgb(200, 75, 0)' : 'rgb(255, 204, 0)';
  
  let resultText = 'Game Draw!';
  if(winner === 'Orange') resultText = 'Orange win!';
  if(winner === 'Yellow') resultText = 'Yellow win!';

  const resultTextColor = winner === 'Orange'
  ? '#000'
  : winner === 'Yellow'
    ? '#000'
    : '#000';
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={[modalStyles.modalOverlay, { backgroundColor: "rgba(0, 0, 0, 0.4)" }]}>
        <View style={[modalStyles.modalContent, { backgroundColor: modalBackgroundColor }]}>
        <Text style={[modalStyles.modalText, { color: resultTextColor, fontSize: 32  }]}>
            {resultText}
          </Text>
          <TouchableOpacity
            style={[modalStyles.modalButton, { backgroundColor: modalButtonBackgroundColor }]}
            onPress={onClose}
          >
            <Text style={modalStyles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
