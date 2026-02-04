function convertSecondsToHMS(totalSeconds: number) {
  if (
    typeof totalSeconds !== "number" ||
    isNaN(totalSeconds) ||
    totalSeconds < 0
  ) {
    throw new Error("Input must be a non-negative number of seconds.");
  }

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
}

export default function formatSecondsToHMS(totalSeconds: number) {
  const { days, hours } = convertSecondsToHMS(totalSeconds);

  return `${days} days, ${hours} hr.`;
}
