import React, { useState } from 'react';
import { View, Text, Vibration } from 'react-native';
import { useFonts, Audiowide_400Regular } from '@expo-google-fonts/audiowide';
import checkWinner from '../Utils/MultiGame/checkWinner';      // Voiton tarkistus
import Board from '../components/MultiGame/Board';             // Luo pelilaudan
import GameModal from '../Modals/MultiGame/ResultModal';       // Lopputulos-modaali
import GameControls from '../components/MultiGame/GameControls'; // uudelleenpelaus- ja kotinappi
import styles from '../styles/TictactoeMultiStyles';    // Tyylit 

export default function TictactoeMultiplayer({ navigation }) {
  // Pelilauta-tila: 9 kohtaa, null = tyhjä ruutu
  const [board, setBoard] = useState(Array(9).fill(null));
  // Kertoo, kumpi pelaa seuraavaksi (true = X, false = O)
  const [isXNext, setIsXNext] = useState(true);
  // Estää lisäsiirtoja pelin päätyttyä
  const [gameOver, setGameOver] = useState(false);
  // Näyttää lopputulos‑modaalin
  const [modalVisible, setModalVisible] = useState(false);
  // Tallentaa voittajan merkin x tai O, tasapelitilanteessa 'Tie'
  const [winner, setWinner] = useState(null);

  // Käsittelee ruudun painalluksen
  const handlePress = (index) => {
    if (board[index] || gameOver) return;  // Ei tee mitään, jos ruutu varattu tai peli ohi

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O'; // Asettaa X tai O riippuu kumman vuoro on
    setBoard(newBoard);

    const win = checkWinner(newBoard);
    if (win) {
      Vibration.vibrate(500);              // Värähdys, kun pelin päättymisen merkiksi
      setWinner(win);                      // Merkitään voittaja
      setGameOver(true);                   // Lopetetaan peli
      setModalVisible(true);               // Näytetään lopputulos‑modaali
      return;
    }

    if (!newBoard.includes(null)) {        // Jos laudalla ei enää tyhjiä ruutuja
      Vibration.vibrate(500);
      setWinner('Tie');                    // Tasapeli
      setGameOver(true);
      setModalVisible(true);
      return;
    }

    setIsXNext(!isXNext);                  // Vaihdetaan vuoroa
  };

  // Nollaa pelin: tyhjentää laudan ja piilotaa modaalit
  const restart = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameOver(false);
    setWinner(null);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>
      <Text style={styles.title2}>Multiplayer</Text>

     {/* Näyttää, kenen vuoro on ja pelin päätyttyä lopputuloksen */}
      <Text style={styles.turnText}>
        {gameOver
          ? (winner === 'Tie' ? "It's a tie!" : `${winner} wins!`)
          : `Whose turn: ${isXNext ? 'X' : 'O'}`}
      </Text>

      {/* Pelilauta-komponentti */}
      <Board board={board} onSquarePress={handlePress} disabled={gameOver} />

      {/* Lopputulos‑modal */}
      <GameModal
        visible={modalVisible}
        message={winner === 'Tie' ? "It's a tie!" : `${winner} wins!`}
        onClose={() => setModalVisible(false)}  // Piilottaa modaalin
      />

      {/* Ohjauspainikkeet: pelaa uudelleen tai palaaminen kotinäyttöön */}
      <GameControls
        onRestart={restart}
        onHome={() => navigation.navigate('Home')}
      />
    </View>
  );
}
