/** Returns `true` if the value is a function. @since 0.1.0 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const isFunction = (value: unknown): value is Function => typeof value === 'function';
