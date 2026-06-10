/**
 * Converts epoch seconds (as delivered by all the APIs the app consumes) to
 * epoch milliseconds, keeping null for missing values.
 */
export function epochSecondsToMilliseconds(epochSeconds: number | null | undefined): number | null {
  if (typeof epochSeconds !== 'number') {
    return null;
  }
  return epochSeconds * 1000;
}
