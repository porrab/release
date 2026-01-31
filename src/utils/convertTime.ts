function convertSecondsToHMS(totalSeconds: number) {
  if (
    typeof totalSeconds !== "number" ||
    isNaN(totalSeconds) ||
    totalSeconds < 0
  ) {
    throw new Error("Input must be a non-negative number of seconds.");
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

export default function formatSecondsToHMS(totalSeconds: number) {
  const { hours, minutes, seconds } = convertSecondsToHMS(totalSeconds);

  const pad = (num: number) => String(num).padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}
