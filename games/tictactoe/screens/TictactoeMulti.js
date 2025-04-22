import React, { useState } from 'react';
import { View, Text, Vibration } from 'react-native';
import checkWinner from '../Utils/MultiGame/checkWinner';     // Funktio tarkistamaan voittaja
import Board from '../components/MultiGame/Board';            // Pelilaudan näyttävä komponentti
import GameModal from '../Modals/MultiGame/ResultModal';      // Lopputulos‑ikkuna
import GameControls from '../components/MultiGame/GameControls'; // Uudelleenkäynnistys‑ ja kotipainikkeet
import styles from '../styles/TictactoeMultiStyles';            //tyylit

export default function TictactoeMultiplayer({ navigation }) {
  // Pelilauta: 9 kohtaa, null = tyhjä, 'X' tai 'O' = pelimerkki
  const [board, setBoard] = useState(Array(9).fill(null));

  // KTeito kuka on seuraavana vuorossa, X:llä (true) ja O:lla (false)
  const [isXNext, setIsXNext] = useState(true);

  // Tila, onko peli jo päättynyt (true) vai ei (false)
  const [gameOver, setGameOver] = useState(false);

  // lopputulos‑ikkuna
  const [modalVisible, setModalVisible] = useState(false);

  // Tallentaa voittajan ('X', 'O' tai 'Tie')
  const [winner, setWinner] = useState(null);

  // Kun pelaaja napauttaa peliruudun
  const handlePress = (index) => {
    if (board[index] || gameOver) return;   // Jos ruutu on täynnä tai peli päättynyt, ei tehdä mitään

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';   // Asetetaan sopiva merkki eli se kenen vuoro on
    setBoard(newBoard);

    // Tarkistetaan, onko uusi lauta johdattanut voittoon
    const win = checkWinner(newBoard);
    if (win) {
      Vibration.vibrate(500);   // Lyhyt värinä kun peli päättyy
      setWinner(win);           // Merkitään voittaja
      setGameOver(true);        // Estetään lisää siirtoja
      setModalVisible(true);    // Näytetään lopputulos‑ikkuna
      return;
    }

    // Jos laudalta ei löydy yhtään tyhjää ruutua, peli on tasan
    if (!newBoard.includes(null)) {
      Vibration.vibrate(500);
      setWinner('Tie');
      setGameOver(true);
      setModalVisible(true);
      return;
    }

    // Vaihdetaan vuoro seuraavalle pelaajalle
    setIsXNext(!isXNext);
  };

  // Aloita peli alusta: tyhjennä lauta ja piilota modaalit
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

      {/* Näyttää, kenen vuoro on tai pelin päätyttyä lopputuloksen */}
      <Text style={styles.turnText}>
        {gameOver
          ? (winner === 'Tie' ? "It's a tie!" : `${winner} wins!`)
          : `Whose turn: ${isXNext ? 'X' : 'O'}`}
      </Text>

      {/* Pelilauta, jossa voi napauttaa ruutuja */}
      <Board board={board} onSquarePress={handlePress} disabled={gameOver} />

      {/* Lopputulos‑ikkuna */}
      <GameModal
        visible={modalVisible}
        message={winner === 'Tie' ? "It's a tie!" : `${winner} wins!`}
        onClose={() => setModalVisible(false)}  // Piilota ikkuna kun suljetaan
      />

      {/* Painikkeet: uudelleenkäynnistys ja kotinäkymään palaaminen */}
      <GameControls
        onRestart={restart}
        onHome={() => navigation.navigate('Home')}
      />
    </View>
  );
}
