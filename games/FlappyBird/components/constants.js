// Tuodaan React Native -kirjaston Dimensions-API
import { Dimensions } from 'react-native';

// Haetaan näytön leveys ja korkeus (screen eli koko laitteenvälilehti)
const { width, height } = Dimensions.get('screen');


//Pelin fysiikka- ja sijoitteluvakioita:
 
export const MAX_WIDTH  = width;    // Näytön leveys
export const MAX_HEIGHT = height;   // Näytön korkeus
export const PIPE_WIDTH = 60;       // Putken vakioleveys
export const GAP_SIZE   = 160;      // Putkien välinen aukko
