/** Returns `true` if the value is a non-null object (excludes arrays). */
export const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
