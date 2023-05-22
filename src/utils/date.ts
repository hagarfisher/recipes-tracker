const DAY_IN_SECONDS = 86400;

export function isWithinLastDay(timestamp: Date) {
  const unixTimeStamp = timestamp.getTime() / 1000;
  const currentDate = new Date().getTime() / 1000;
  return currentDate - unixTimeStamp < DAY_IN_SECONDS;
}

/**
 * @param timestamp string, looks like this: 2023-04-01T18:24:34.407554
 * @returns string
 */
export function formatStringifiedTimestampToDate(timestamp: string): string {
  return timestamp.slice(0, timestamp.indexOf("T"));
}
