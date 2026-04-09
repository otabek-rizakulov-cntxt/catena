/** Returns `true` if the value is a finite number (excludes NaN). */
export const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);
