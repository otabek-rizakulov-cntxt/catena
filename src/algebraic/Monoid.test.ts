import { describe, it, expect } from 'vitest';
import {
  foldMap,
  MonoidSum,
  MonoidProduct,
  MonoidString,
  MonoidAll,
  MonoidAny,
  getMonoidArray,
} from './Monoid';

describe('MonoidSum', () => {
  it('has 0 as identity', () => {
    expect(MonoidSum.concat(5, MonoidSum.empty)).toBe(5);
    expect(MonoidSum.concat(MonoidSum.empty, 5)).toBe(5);
  });
});

describe('MonoidProduct', () => {
  it('has 1 as identity', () => {
    expect(MonoidProduct.concat(5, MonoidProduct.empty)).toBe(5);
    expect(MonoidProduct.concat(MonoidProduct.empty, 5)).toBe(5);
  });
});

describe('MonoidString', () => {
  it('has empty string as identity', () => {
    expect(MonoidString.concat('hello', MonoidString.empty)).toBe('hello');
    expect(MonoidString.concat(MonoidString.empty, 'hello')).toBe('hello');
  });
});

describe('MonoidAll', () => {
  it('has true as identity', () => {
    expect(MonoidAll.concat(false, MonoidAll.empty)).toBe(false);
    expect(MonoidAll.concat(MonoidAll.empty, true)).toBe(true);
  });
});

describe('MonoidAny', () => {
  it('has false as identity', () => {
    expect(MonoidAny.concat(true, MonoidAny.empty)).toBe(true);
    expect(MonoidAny.concat(MonoidAny.empty, false)).toBe(false);
  });
});

describe('getMonoidArray', () => {
  it('has empty array as identity', () => {
    const M = getMonoidArray<number>();
    expect(M.concat([1, 2], M.empty)).toEqual([1, 2]);
    expect(M.concat(M.empty, [1, 2])).toEqual([1, 2]);
  });
});

describe('foldMap', () => {
  it('maps and folds using a monoid', () => {
    const sumLengths = foldMap(MonoidSum, (s: string) => s.length);
    expect(sumLengths(['hello', 'world', '!'])).toBe(11);
  });

  it('returns empty for an empty array', () => {
    const sumLengths = foldMap(MonoidSum, (s: string) => s.length);
    expect(sumLengths([])).toBe(0);
  });

  it('works with MonoidAll', () => {
    const allPositive = foldMap(MonoidAll, (n: number) => n > 0);
    expect(allPositive([1, 2, 3])).toBe(true);
    expect(allPositive([1, -1, 3])).toBe(false);
  });

  it('works with MonoidString', () => {
    const joinNames = foldMap(MonoidString, (s: string) => `[${s}]`);
    expect(joinNames(['a', 'b'])).toBe('[a][b]');
  });
});
