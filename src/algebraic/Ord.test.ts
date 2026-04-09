import { describe, it, expect } from 'vitest';
import { fromCompare, OrdNumber, OrdString, OrdBoolean, min, max, clamp } from './Ord';

describe('OrdNumber', () => {
  it('returns -1 for less than', () => {
    expect(OrdNumber.compare(1, 2)).toBe(-1);
  });

  it('returns 0 for equal', () => {
    expect(OrdNumber.compare(5, 5)).toBe(0);
  });

  it('returns 1 for greater than', () => {
    expect(OrdNumber.compare(3, 1)).toBe(1);
  });

  it('derives equals from compare', () => {
    expect(OrdNumber.equals(5, 5)).toBe(true);
    expect(OrdNumber.equals(1, 2)).toBe(false);
  });
});

describe('OrdString', () => {
  it('compares strings lexicographically', () => {
    expect(OrdString.compare('a', 'b')).toBe(-1);
    expect(OrdString.compare('b', 'a')).toBe(1);
    expect(OrdString.compare('a', 'a')).toBe(0);
  });
});

describe('OrdBoolean', () => {
  it('compares booleans (false < true)', () => {
    expect(OrdBoolean.compare(false, true)).toBe(-1);
    expect(OrdBoolean.compare(true, false)).toBe(1);
    expect(OrdBoolean.compare(true, true)).toBe(0);
  });
});

describe('fromCompare', () => {
  it('creates an Ord with derived equals', () => {
    const OrdLen = fromCompare<string>((x, y) =>
      x.length < y.length ? -1 : x.length > y.length ? 1 : 0,
    );
    expect(OrdLen.compare('ab', 'xyz')).toBe(-1);
    expect(OrdLen.equals('ab', 'cd')).toBe(true);
  });
});

describe('min', () => {
  it('returns the smaller value', () => {
    expect(min(OrdNumber)(3, 7)).toBe(3);
    expect(min(OrdNumber)(7, 3)).toBe(3);
  });

  it('returns the first when equal', () => {
    expect(min(OrdNumber)(5, 5)).toBe(5);
  });
});

describe('max', () => {
  it('returns the larger value', () => {
    expect(max(OrdNumber)(3, 7)).toBe(7);
    expect(max(OrdNumber)(7, 3)).toBe(7);
  });

  it('returns the first when equal', () => {
    expect(max(OrdNumber)(5, 5)).toBe(5);
  });
});

describe('clamp', () => {
  it('clamps a value to the range', () => {
    const clampNum = clamp(OrdNumber)(0, 10);
    expect(clampNum(5)).toBe(5);
    expect(clampNum(-3)).toBe(0);
    expect(clampNum(15)).toBe(10);
  });

  it('returns low when value equals low', () => {
    expect(clamp(OrdNumber)(0, 10)(0)).toBe(0);
  });

  it('returns high when value equals high', () => {
    expect(clamp(OrdNumber)(0, 10)(10)).toBe(10);
  });
});
