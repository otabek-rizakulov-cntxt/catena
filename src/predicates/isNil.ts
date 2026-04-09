/** Returns `true` if the value is `null` or `undefined`. @since 0.1.0 */
export const isNil = (value: unknown): value is null | undefined => value == null;
