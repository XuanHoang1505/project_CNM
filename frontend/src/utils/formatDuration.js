export const formatDurationToHMS = (duration) => {
  const { hours, minutes, seconds } = duration;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

export const formatDurationToObject = (durationString) => {
  if (!durationString) return { hours: 0, minutes: 0, seconds: 0 };

  const [hours, minutes, seconds] = durationString.split(":").map(Number);

  // Trả về object chứa hours, minutes, seconds
  return {
    hours: isNaN(hours) ? 0 : hours,
    minutes: isNaN(minutes) ? 0 : minutes,
    seconds: isNaN(seconds) ? 0 : seconds,
  };
};
