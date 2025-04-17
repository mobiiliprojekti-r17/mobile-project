import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import styles from '../../styles/SudokuStyles';

export function InstructionsModal({ visible, onClose }) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Instructions</Text>
          <View style={styles.InfoContainer}>
          <Text style={styles.ModalInfoText}>Value mode: </Text>
          <Text style={styles.ModalInfo2Text}>Tap a cell and then a number to enter your answer</Text>
          </View>
          <View style={styles.InfoContainer}>
          <Text style={styles.ModalInfoText}>Notes mode: </Text>
          <Text style={styles.ModalInfo2Text}>Add or delete small notes in a cell </Text>
          </View>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function ErrorModal({ visible, message, onClose }) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{message}</Text>
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>OK</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export function DifficultyModal({ visible, onSelectDifficulty, onClose }) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Select Difficulty</Text>
          {['EASY', 'MEDIUM', 'HARD'].map(level => (
            <Pressable
              key={level}
              style={[styles.button, styles.modalOption]}
              onPress={() => onSelectDifficulty(level)}
            >
              <Text style={styles.textStyle}>{level}</Text>
            </Pressable>
          ))}
          <Pressable
            style={[styles.button, styles.buttonClose, { marginTop: 8 }]}
            onPress={onClose}
          >
            <Text style={styles.textStyle}>CANCEL</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
