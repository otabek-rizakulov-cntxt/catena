import { describe, it, expect } from 'vitest';
import { SetoidStrict, SetoidNumber, SetoidString, SetoidBoolean, getSetoidArray } from './Setoid';

describe('SetoidStrict', () => {
  it('compares by strict equality', () => {
    expect(SetoidStrict.equals(1, 1)).toBe(true);
    expect(SetoidStrict.equals(1, 2)).toBe(false);
    expect(SetoidStrict.equals('a', 'a')).toBe(true);
  });
});

describe('SetoidNumber', () => {
  it('compares numbers', () => {
    expect(SetoidNumber.equals(42, 42)).toBe(true);
    expect(SetoidNumber.equals(1, 2)).toBe(false);
  });
});

describe('SetoidString', () => {
  it('compares strings', () => {
    expect(SetoidString.equals('hello', 'hello')).toBe(true);
    expect(SetoidString.equals('a', 'b')).toBe(false);
  });
});

describe('SetoidBoolean', () => {
  it('compares booleans', () => {
    expect(SetoidBoolean.equals(true, true)).toBe(true);
    expect(SetoidBoolean.equals(true, false)).toBe(false);
  });
});

describe('getSetoidArray', () => {
  it('compares arrays element-wise', () => {
    const S = getSetoidArray(SetoidNumber);
    expect(S.equals([1, 2, 3], [1, 2, 3])).toBe(true);
    expect(S.equals([1, 2], [1, 3])).toBe(false);
  });

  it('returns false for different lengths', () => {
    const S = getSetoidArray(SetoidNumber);
    expect(S.equals([1, 2], [1, 2, 3])).toBe(false);
  });

  it('returns true for two empty arrays', () => {
    const S = getSetoidArray(SetoidNumber);
    expect(S.equals([], [])).toBe(true);
  });
});
