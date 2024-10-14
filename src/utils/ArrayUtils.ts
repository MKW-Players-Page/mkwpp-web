export function normalizeIntoArray<T>(a: T | T[]): T[] {
  if (Array.isArray(a)) {
    return a;
  }
  return [a];
}
