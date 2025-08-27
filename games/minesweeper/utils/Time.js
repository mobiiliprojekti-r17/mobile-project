// Muuntaa sekundit tekstimuotoon "m:ss" tai palauttaa "N/A", jos arvoa ei ole
export const formattedTime = (timeInSeconds) => {
  if (timeInSeconds == null) return "N/A";   
  const minutes = Math.floor(timeInSeconds / 60);         // Laske kokonaiset minuutit
  const secs = timeInSeconds % 60;                        // Jäljelle jäävät sekunnit
  // Palauttaa muodon "m:ss", lisää ykkösten eteen nollan, jos sekunteja alle 10
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};
