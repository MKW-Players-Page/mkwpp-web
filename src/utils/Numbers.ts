/** Converts a given value to a number using the unary `+` operator. If the given value is falsy
 * but not zero, or if conversion results in `NaN`, return the fallback value. Otherwise, return
 * the converted value.
 *
 * @param value The value to convert to a number
 * @param fallback The value to return if `value` can't be converted to a number
 * @returns The converted number, or the fallback if conversion failed
 */
export const numberOr = (value: any, fallback: number) => {
  return (value === 0 || value) && !Number.isNaN(+value) ? +value : fallback;
};

/** Return the given value converted using `numberOr` if it is a whole number. Otherwise, return
 * the fallback value.
 *
 * @param value The value to convert to a whole number
 * @param fallback The value to return if `value` can't be converted to a whole number
 * @returns The converted number, or the fallback if conversion failed
 */
export const integerOr = (value: any, fallback: number) => {
  const num = numberOr(value, 0.5);
  return num % 1 === 0 ? num : fallback;
};

/** Filter out any non-numerical character from a string
 * @param value string to parse
 */
export const filterOnlyNumerical = (value: string): string => {
  let outStr = "";
  for (let i = 0; i < value.length; i++) if ("0123456789".includes(value[i])) outStr += value[i];

  return outStr;
};

/** Return the parsed value of only the numbers within the string
 * @param value string to parse
 */
export const parseOnlyNumbers = (value: string): number => {
  return parseInt(filterOnlyNumerical(value));
};

/** Destructure a time value into minutes, seconds, and milliseconds. */
export const destructureTimeValue = (time: number) => {
  const minutes = Math.trunc(time / 60000);
  const seconds = Math.trunc((time % 60000) / 1000);
  const millis = time % 1000;
  return { minutes, seconds, millis };
};

/** Combine minutes, seconds, and milliseconds into a single time value. */
export const toTimeValue = (minutes: number, seconds: number, millis: number) => {
  return minutes * 60000 + seconds * 1000 + millis;
};

/* 2008-04-16 12:00 AM UTC */
export const mkwReleaseDate = 1208289600000;
