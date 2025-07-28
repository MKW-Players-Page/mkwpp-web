/**
 * Warning! Inputs must be sorted in the same way
 * @param array1
 * @param array2
 * @returns whether the arrays are equal in contents
 */
export const arrayEquals = <T>(
  array1: T[],
  array2: T[],
  compareFn?: (a: T, b: T) => number,
): boolean => {
  if (array1.length !== array2.length) return false;

  if (compareFn) {
    array1.sort(compareFn);
    array2.sort(compareFn);
  }

  for (const i in array1) {
    if (array1[i] !== array2[i]) return false;
  }

  return true;
};
