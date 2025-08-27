import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import modalStyles from '../styles/ModalStyles'; 

// Single‑player pelin lopputulos‑modal
export const ResultModalsingle = ({ visible, winner, onClose }) => {
  // Valitse modalin taustaväri voittajan mukaan
  const modalBackgroundColor =
    winner === 'Orange' ? 'rgb(255, 94, 0)' : 'rgb(255, 234, 0)';
  // Valitse OK‑napin väri voittajan mukaan
  const modalButtonBackgroundColor =
    winner === 'Orange' ? 'rgb(200, 75, 0)' : 'rgb(255, 204, 0)';
  
  // Muodosta lopputeksti: tason mukaan "You win!" tai "AI win!" tai tasapeli
  let resultText = 'Game Draw!';
  if (winner === 'Orange') resultText = 'AI win!';
  if (winner === 'Yellow') resultText = 'You win!';

  // Tekstin väri 
  const resultTextColor = '#000';

  return (
    <Modal
      animationType="slide"  
      transparent 
      visible={visible} 
      onRequestClose={onClose} 
    >
      <View style={[
        modalStyles.modalOverlay,
        { backgroundColor: "rgba(0, 0, 0, 0.4)" }
      ]}>
        <View style={[
          modalStyles.modalContent,
          { backgroundColor: modalBackgroundColor }
        ]}>
          {/* Tulosteksti isolla fontilla */}
          <Text style={[
            modalStyles.modalText,
            { color: resultTextColor, fontSize: 32 }
          ]}>
            {resultText}
          </Text>
          {/* OK‑nappi sulkee modalin */}
          <TouchableOpacity
            style={[
              modalStyles.modalButton,
              { backgroundColor: modalButtonBackgroundColor }
            ]}
            onPress={onClose}
          >
            <Text style={modalStyles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// Multiplayer pelin lopputulos‑modal (samat logiikat eri teksteillä)
export const ResultModalmulti = ({ visible, winner, onClose }) => {
  const modalBackgroundColor =
    winner === 'Orange' ? 'rgb(255, 94, 0)' : 'rgb(255, 234, 0)';
  const modalButtonBackgroundColor =
    winner === 'Orange' ? 'rgb(200, 75, 0)' : 'rgb(255, 204, 0)';
  
  let resultText = 'Game Draw!';
  if (winner === 'Orange') resultText = 'Orange win!';
  if (winner === 'Yellow') resultText = 'Yellow win!';

  const resultTextColor = '#000';

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={[
        modalStyles.modalOverlay,
        { backgroundColor: "rgba(0, 0, 0, 0.4)" }
      ]}>
        <View style={[
          modalStyles.modalContent,
          { backgroundColor: modalBackgroundColor }
        ]}>
          <Text style={[
            modalStyles.modalText,
            { color: resultTextColor, fontSize: 32 }
          ]}>
            {resultText}
          </Text>
          <TouchableOpacity
            style={[
              modalStyles.modalButton,
              { backgroundColor: modalButtonBackgroundColor }
            ]}
            onPress={onClose}
          >
            <Text style={modalStyles.modalButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
