import { describe, it, expect } from 'vitest';
import { isNil } from './isNil';
import { isString } from './isString';
import { isNumber } from './isNumber';
import { isBoolean } from './isBoolean';
import { isFunction } from './isFunction';
import { isArray } from './isArray';
import { isObject } from './isObject';
import { not } from './not';

describe('isNil', () => {
  it('returns true for null', () => expect(isNil(null)).toBe(true));
  it('returns true for undefined', () => expect(isNil(undefined)).toBe(true));
  it('returns false for 0', () => expect(isNil(0)).toBe(false));
  it('returns false for empty string', () => expect(isNil('')).toBe(false));
  it('returns false for false', () => expect(isNil(false)).toBe(false));
});

describe('isString', () => {
  it('returns true for strings', () => expect(isString('hello')).toBe(true));
  it('returns true for empty string', () => expect(isString('')).toBe(true));
  it('returns false for number', () => expect(isString(42)).toBe(false));
  it('returns false for null', () => expect(isString(null)).toBe(false));
});

describe('isNumber', () => {
  it('returns true for numbers', () => expect(isNumber(42)).toBe(true));
  it('returns true for 0', () => expect(isNumber(0)).toBe(true));
  it('returns true for negative', () => expect(isNumber(-1)).toBe(true));
  it('returns false for NaN', () => expect(isNumber(NaN)).toBe(false));
  it('returns false for Infinity', () => expect(isNumber(Infinity)).toBe(false));
  it('returns false for string', () => expect(isNumber('42')).toBe(false));
});

describe('isBoolean', () => {
  it('returns true for true', () => expect(isBoolean(true)).toBe(true));
  it('returns true for false', () => expect(isBoolean(false)).toBe(true));
  it('returns false for 1', () => expect(isBoolean(1)).toBe(false));
  it('returns false for null', () => expect(isBoolean(null)).toBe(false));
});

describe('isFunction', () => {
  it('returns true for functions', () => expect(isFunction(() => {})).toBe(true));
  it('returns true for arrow functions', () => expect(isFunction(isFunction)).toBe(true));
  it('returns false for objects', () => expect(isFunction({})).toBe(false));
  it('returns false for null', () => expect(isFunction(null)).toBe(false));
});

describe('isArray', () => {
  it('returns true for arrays', () => expect(isArray([1, 2])).toBe(true));
  it('returns true for empty arrays', () => expect(isArray([])).toBe(true));
  it('returns false for objects', () => expect(isArray({})).toBe(false));
  it('returns false for strings', () => expect(isArray('hello')).toBe(false));
});

describe('isObject', () => {
  it('returns true for plain objects', () => expect(isObject({ a: 1 })).toBe(true));
  it('returns true for empty objects', () => expect(isObject({})).toBe(true));
  it('returns false for null', () => expect(isObject(null)).toBe(false));
  it('returns false for arrays', () => expect(isObject([1, 2])).toBe(false));
  it('returns false for strings', () => expect(isObject('hello')).toBe(false));
});

describe('not', () => {
  it('negates a predicate', () => {
    const isPositive = (n: number) => n > 0;
    const isNotPositive = not(isPositive);
    expect(isNotPositive(5)).toBe(false);
    expect(isNotPositive(-1)).toBe(true);
    expect(isNotPositive(0)).toBe(true);
  });

  it('works with type guard predicates', () => {
    const isNotNil = not(isNil);
    expect(isNotNil(42)).toBe(true);
    expect(isNotNil(null)).toBe(false);
  });
});
