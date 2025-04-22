import React, { useState } from 'react';
import { View, Text, Vibration } from 'react-native';
import styles from '../styles/TictactoeSingleStyles'; // Tyylitiedosto
import Board from '../components/SingleGame/Board'; // Pelilaudan näyttävä komponentti, joka piirtää ruudukon ja nappaat ruutuja
import GameControls from '../components/SingleGame/GameControls'; // Ohjauspainikkeet (uudelleenkäynnistys, kotinappi) pelin alareunaan
import LevelModal from '../Modals/SingleGame/LevelModal'; // Modaali, jossa käyttäjä valitsee tekoälyn vaikeustason
import ResultModal from '../Modals/SingleGame/ResultModal';// Modaali, joka näyttää pelin lopputuloksen (voitto/tasapeli/tappio)
import { checkWinner, makeAIMove } from '../Utils/SingleGame/gameUtils'; // Pelin util‑funktiot: checkWinner tarkistaa voittajan, makeAIMove laskee tekoälyn siirron

export default function TictactoeSingleplayer({ navigation }) {
  // Pelilauta on 9 paikkaa (null = tyhjä, 'X' = pelaaja, 'O' = tekoäly)
  const [board, setBoard] = useState(Array(9).fill(null));

  // Kertoo, onko nyt pelaajan vuoro (true) vai tekoälyn (false)
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);

  // Merkki, jos peli on päättynyt eikä uusia siirtoja sallita
  const [gameOver, setGameOver] = useState(false);

  // Näytetään alussa tason valintaruutu
  const [levelModalVisible, setLevelModalVisible] = useState(true);

  // Näytetään lopputulosruutu vasta pelin jälkeen
  const [resultModalVisible, setResultModalVisible] = useState(false);

  // Pelin vaikeustaso (easy, medium, impossible)
  const [level, setLevel] = useState('medium');

  // Viesti lopputuloksesta
  const [resultMessage, setResultMessage] = useState('');

  // Muistaa, avautuiko tason valinta-modal kotinäyöltä vai pelinäytöltä
  const [modalSource, setModalSource] = useState('initial');

  // Uudelleenkäynnistys: avaa tason valinnan uudelleen
  const restart = () => {
    setModalSource('restart');
    setLevelModalVisible(true);
  };

  // Kun käyttäjä valitsee vaikeustason
  const handleSelectLevel = l => {
    setLevel(l);
    setLevelModalVisible(false);
    // Jos tultiin restart-napin kautta, tyhjennetään lauta ja nollataan tilat
    if (modalSource === 'restart') {
      setBoard(Array(9).fill(null));
      setIsPlayerTurn(true);
      setGameOver(false);
    }
  };

  // Kun käyttäjä peruuttaa tason valinnan
  const handleCancelLevel = () => {
    setLevelModalVisible(false);
    // Jos peruutus tuli etusivun kautta, mennään takaisin etusivulle
    if (modalSource === 'initial') {
      navigation.goBack();
    }
  };

  // Kun pelaaja klikkaa tyhjää ruutua
  const handleSquarePress = idx => {
    if (board[idx] || gameOver) return;  // ei tapahdu mitään, jos ruutu on jo täynnä tai peli ohi

    const newBoard = [...board];
    newBoard[idx] = 'X';   // merkitään pelaajan siirto
    setBoard(newBoard);
    setIsPlayerTurn(false);    // siirrytään tekoälyn vuoroon

    const winner = checkWinner(newBoard);
    if (winner) return endGame(winner);  // lopetaan, jos peli päättyi tässä
    if (!newBoard.includes(null)) return endGame(null);  // tasapeli

    // Tekoäly tekee siirtonsa puolen sekunnin viiveellä
    setTimeout(() => {
      const aiIdx = makeAIMove([...newBoard], level);
      if (aiIdx != null) {
        newBoard[aiIdx] = 'O';  // tekoäly merkitsee
        setBoard(newBoard);
        const w = checkWinner(newBoard);
        if (w) return endGame(w);  // tarkistaa voittiko tekoäly
      }
      setIsPlayerTurn(true);   // takaisin pelaajan vuoroon
    }, 500);
  };

  // Lopettaa pelin: värinä ja lopputulos-modal aukeaa
  const endGame = winner => {
    Vibration.vibrate(500);
    setGameOver(true);
    setResultMessage(
      winner ? (winner === 'X' ? 'You' : 'AI') + ' win!' : 'It is a tie!'
    );
    setResultModalVisible(true);
  };
// Sulkee lopputulos‑ikkunan
  const closeResult = () => setResultModalVisible(false);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tic-Tac-Toe</Text>
      <Text style={styles.title2}>Singleplayer</Text>

      {/* Vaikeustason valinta-ikkuna */}
      <LevelModal
        visible={levelModalVisible}
        onSelect={handleSelectLevel}
        onCancel={handleCancelLevel}
      />

      {/* Näyttää, kenen vuoro on tai pelin päätyttyä lopputuloksen */}
      <Text style={styles.turnText}>
        {gameOver
          ? resultMessage
          : `Whose turn: ${isPlayerTurn ? 'You' : 'AI'}`}
      </Text>

      {/* Pelilauta komponenttina */}
      <Board
        board={board}
        onSquarePress={handleSquarePress}
        disabled={gameOver}
      />

      {/* Uudelleenkäynnistys- ja kotinapit */}
      <GameControls
        onRestart={restart}
        onHome={() => navigation.navigate('Home')}
      />

      {/* Lopputulos-ikkuna */}
      <ResultModal
        visible={resultModalVisible}
        message={resultMessage}
        onClose={closeResult}
      />
    </View>
  );
}
