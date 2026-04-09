/** Returns `true` if the value is `null` or `undefined`. */
export const isNil = (value: unknown): value is null | undefined => value == null;
