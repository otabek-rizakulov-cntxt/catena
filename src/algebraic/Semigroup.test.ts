import { describe, it, expect } from 'vitest';
import {
  concatAll,
  SemigroupSum,
  SemigroupProduct,
  SemigroupString,
  SemigroupAll,
  SemigroupAny,
  getSemigroupArray,
} from './Semigroup';

describe('SemigroupSum', () => {
  it('adds numbers', () => {
    expect(SemigroupSum.concat(1, 2)).toBe(3);
  });

  it('is associative', () => {
    const a = 1,
      b = 2,
      c = 3;
    expect(SemigroupSum.concat(SemigroupSum.concat(a, b), c)).toBe(
      SemigroupSum.concat(a, SemigroupSum.concat(b, c)),
    );
  });
});

describe('SemigroupProduct', () => {
  it('multiplies numbers', () => {
    expect(SemigroupProduct.concat(3, 4)).toBe(12);
  });

  it('is associative', () => {
    const a = 2,
      b = 3,
      c = 4;
    expect(SemigroupProduct.concat(SemigroupProduct.concat(a, b), c)).toBe(
      SemigroupProduct.concat(a, SemigroupProduct.concat(b, c)),
    );
  });
});

describe('SemigroupString', () => {
  it('concatenates strings', () => {
    expect(SemigroupString.concat('hello', ' world')).toBe('hello world');
  });

  it('is associative', () => {
    expect(SemigroupString.concat(SemigroupString.concat('a', 'b'), 'c')).toBe(
      SemigroupString.concat('a', SemigroupString.concat('b', 'c')),
    );
  });
});

describe('SemigroupAll', () => {
  it('returns true when both are true', () => {
    expect(SemigroupAll.concat(true, true)).toBe(true);
  });

  it('returns false when either is false', () => {
    expect(SemigroupAll.concat(true, false)).toBe(false);
    expect(SemigroupAll.concat(false, true)).toBe(false);
  });
});

describe('SemigroupAny', () => {
  it('returns true when either is true', () => {
    expect(SemigroupAny.concat(false, true)).toBe(true);
  });

  it('returns false when both are false', () => {
    expect(SemigroupAny.concat(false, false)).toBe(false);
  });
});

describe('getSemigroupArray', () => {
  it('concatenates arrays', () => {
    const S = getSemigroupArray<number>();
    expect(S.concat([1, 2], [3, 4])).toEqual([1, 2, 3, 4]);
  });

  it('handles empty arrays', () => {
    const S = getSemigroupArray<number>();
    expect(S.concat([], [1])).toEqual([1]);
    expect(S.concat([1], [])).toEqual([1]);
  });
});

describe('concatAll', () => {
  it('folds an array with a semigroup', () => {
    expect(concatAll(SemigroupSum)(0)([1, 2, 3, 4])).toBe(10);
  });

  it('returns startWith for an empty array', () => {
    expect(concatAll(SemigroupSum)(0)([])).toBe(0);
  });

  it('works with strings', () => {
    expect(concatAll(SemigroupString)('')(['a', 'b', 'c'])).toBe('abc');
  });
});
