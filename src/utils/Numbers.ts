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
