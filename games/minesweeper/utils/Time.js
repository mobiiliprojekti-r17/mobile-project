export const formattedTime = (timeInSeconds) => {
    if (timeInSeconds == null) return "N/A";
    const minutes = Math.floor(timeInSeconds / 60);
    const secs = timeInSeconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };
  