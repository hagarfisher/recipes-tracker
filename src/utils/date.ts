const DAY_IN_SECONDS = 86400;

export function isWithinLastDay(timestamp: Date) {
  const unixTimeStamp = timestamp.getTime() / 1000;
  const currentDate = new Date().getTime() / 1000;
  return currentDate - unixTimeStamp < DAY_IN_SECONDS;
}
