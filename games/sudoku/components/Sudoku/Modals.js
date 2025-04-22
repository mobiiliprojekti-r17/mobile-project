import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import styles from '../../styles/SudokuStyles';

// Näyttää pelin ohjeet modaalina
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
          {/* Selitetään, miten pelissä syöttö- ja muistiinpanotila toimivat */}
          <View style={styles.InfoContainer}>
            <Text style={styles.ModalInfoText}>Value mode: </Text>
            <Text style={styles.ModalInfo2Text}>
              Tap a cell and then a number to enter your answer
            </Text>
          </View>
          <View style={styles.InfoContainer}>
            <Text style={styles.ModalInfoText}>Notes mode: </Text>
            <Text style={styles.ModalInfo2Text}>
              Add or delete small notes in a cell
            </Text>
          </View>
          {/* Sulje-painike piilottaa modalin */}
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

// Näyttää virheilmoituksen modaalina
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
          {/* Näytetään virheviesti käyttäjälle */}
          <Text style={styles.modalText}>{message}</Text>
          {/* OK-painike sulkee modalin */}
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

// Kysyy käyttäjältä vaikeustason
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
          {/* Luo napit EASY, MEDIUM, HARD valinnoille */}
          {['EASY', 'MEDIUM', 'HARD'].map(level => (
            <Pressable
              key={level}
              style={[styles.button, styles.modalOption]}
              onPress={() => onSelectDifficulty(level)}  // Valitaan vaikeustaso
            >
              <Text style={styles.textStyle}>{level}</Text>
            </Pressable>
          ))}
          {/* Peruuta-painike sulkee modalin ilman valintaa */}
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
