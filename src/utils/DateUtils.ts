/** Converts a given date to a milliseconds number using the unary `+` operator, then divides by 1000 and floors to convert it to seconds.
 *
 * @param date The date to convert to a number
 * @returns The converted number
 */
export const dateToSeconds = (date: Date): number => {
  return Math.floor(+date / 1000);
};

/** Converts a given date to a milliseconds number using the unary `+` operator, then divides by 1000 and floors to convert it to seconds.
 *
 * @param date The date to convert to a number
 * @returns The converted number
 */
export const secondsToDate = (seconds: number): Date => {
  return new Date(seconds * 1000);
};
